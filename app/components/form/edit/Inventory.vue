<script setup lang="ts">
import {updateInventory} from "~/services/api.ts";

const props = defineProps<{
  inventory: Inventory
  categories: InventoryCategory[]
  locations: InventoryLocation[]
}>();

const emit = defineEmits<{
  saved: [];
  cancel: [];
}>();

const uid = useId();

const stateOptions = [
  {value: "available", label: "Disponible"},
  {value: "in_use", label: "En utilisation"},
  {value: "broken", label: "Cassé"},
  {value: "lost", label: "Perdu"}
];

const sending = ref(false);
const error = ref("");
const success = ref(false);

const toId = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "string") return value.split("/").pop() ?? "";
  if (typeof value === "object" && "id" in value) return String((value as { id: unknown }).id);
  return "";
};

const toForm = (inventory: Inventory) => ({
  name: inventory.name,
  description: inventory.description ?? "",
  quantity: inventory.quantity,
  status: inventory.status,
  category: toId(inventory.category),
  location: toId(inventory.location),
  used_by: toId(inventory.used_by),
  purchase_date: inventory.purchase_date?.slice(0, 10) ?? "",
  purchase_price: inventory.purchase_price == null ? "" : String(inventory.purchase_price),
  warranty_expires_at: inventory.warranty_expires_at?.slice(0, 10) ?? "",
});

const form = ref(toForm(props.inventory));

watch(() => props.inventory, (inventory) => {
  form.value = toForm(inventory);
  success.value = false;
});

const categoryOptions = computed(() => [
  {value: "", label: "Aucune"},
  ...props.categories.map((c) => ({value: String(c.id), label: c.name}))
]);

const locationOptions = computed(() => [
  {value: "", label: "Aucune"},
  ...props.locations.map((l) => ({value: String(l.id), label: l.name}))
]);

const usedByOptions = computed(() => [
  {value: "", label: "Personne"},
  ...stateOptions
      .filter((i) => i.value !== props.inventory.used_by)
      .map((i) => ({value: String(i.value), label: i.label})),
]);

const isValid = computed(() =>
    [form.value.name, form.value.category, form.value.location].every((field) => field.trim() !== "")
);

function normalizePrice(value: string): string | null {
  const normalized = value.trim().replace(",", ".");
  if (normalized === "") return null;

  const n = Number(normalized);
  return Number.isFinite(n) ? n.toFixed(2) : null;
}

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    const payload: InventoryPayload = {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      quantity: Number(form.value.quantity),
      purchase_date: form.value.purchase_date || null,
      warranty_expires_at: form.value.warranty_expires_at || null,
      purchase_price: normalizePrice(form.value.purchase_price),
      status: form.value.status,
      used_by: form.value.used_by ? '/inventories/' + form.value.used_by.trim() : null,
      category: '/inventory-categories/' + form.value.category.trim(),
      location: '/inventory-locations/' + form.value.location.trim(),
    };

    await updateInventory(props.inventory.id, payload);

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible de modifier l'objet d'inventaire.";
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <div class="inventory-form-container">
    <UiElementsLoader v-if="sending"/>

    <form class="inventory-form form edit-form" @submit.prevent="submitForm" v-show="!sending">
      <div class="form-row full">
        <div class="form-group">
          <label :for="`${uid}-name`">Nom*</label>
          <input :id="`${uid}-name`" v-model="form.name" name="name" type="text" required placeholder="Nom du produit">
        </div>
        <div class="form-group">
          <UiElementsFormSelect
              v-model="form.status"
              label="État"
              :options="stateOptions"
          />
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label :for="`${uid}-quantity`">Quantité*</label>
          <input :id="`${uid}-quantity`" v-model="form.quantity" name="quantity" type="number" required placeholder="Quantité">
        </div>
        <div class="form-group">
          <UiElementsFormSelect
              v-model="form.category"
              label="Catégorie"
              :options="categoryOptions"
          />
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <UiElementsFormSelect
              v-model="form.location"
              label="Emplacement"
              :options="locationOptions"
          />
        </div>
        <div class="form-group">
          <UiElementsFormSelect
              v-model="form.used_by"
              label="Utilisé par (produit)"
              :options="usedByOptions"
          />
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label :for="`${uid}-purchase-date`">Date d'achat</label>
          <input :id="`${uid}-purchase-date`" v-model="form.purchase_date" name="purchase_date" type="date">
        </div>
        <div class="form-group">
          <label :for="`${uid}-purchase-price`">Prix d'achat</label>
          <input :id="`${uid}-purchase-price`" v-model="form.purchase_price" name="purchase_price" type="text" placeholder="Prix d'achat">
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label :for="`${uid}-warranty`">Fin de garantie</label>
          <input :id="`${uid}-warranty`" v-model="form.warranty_expires_at" name="warranty_end_date" type="date">
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label :for="`${uid}-description`">Description</label>
          <textarea :id="`${uid}-description`" v-model="form.description" name="description" placeholder="Détails (optionnel)"/>
        </div>
      </div>

      <div v-if="error || success" class="form-row">
        <UiElementsFlashMessage v-if="error" :type="'error'">{{ error }}</UiElementsFlashMessage>
        <UiElementsFlashMessage v-if="success" :type="'success'">L'objet a été modifié.</UiElementsFlashMessage>
      </div>

      <div class="form-row actions">
        <button type="button" @click="emit('cancel')">Annuler</button>
        <button type="submit" :disabled="!isValid || sending">
          <UiIconsSave/>
          Enregistrer
        </button>
      </div>
    </form>
  </div>
</template>