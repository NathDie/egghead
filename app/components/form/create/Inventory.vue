<script setup lang="ts">
import {saveInventory} from "~/services/api.ts";

const props = defineProps<{
  categories: InventoryCategory[]
  locations: InventoryLocation[]
  inventories: Inventory[]
}>();

const emit = defineEmits<{
  saved: [];
  close: [];
}>();

const stateOptions = [
  {value: "available", label: "Disponible"},
  {value: "in_use", label: "En utilisation"},
  {value: "broken", label: "Cassé"},
  {value: "lost", label: "Perdu"}
];

const sending = ref(false);
const error = ref("");
const success = ref(false);

const name = ref("");
const state = ref("available");
const quantity = ref(1);
const category = ref("");
const location = ref("");
const usedBy = ref("");
const buyAt = ref("");
const buyPrice = ref("");
const warrantyEndAt = ref("");
const description = ref("");

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
  ...props.inventories.map((i) => ({value: String(i.id), label: i.name})),
]);

const isValid = computed(() =>
    [name, category, location].every((field) => field.value.trim() !== "")
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
      name: name.value.trim(),
      description: description.value.trim(),
      quantity: quantity.value,
      purchase_date: buyAt.value || null,
      warranty_expires_at: warrantyEndAt.value || null,
      purchase_price: normalizePrice(buyPrice.value),
      status: state.value,
      used_by: usedBy.value ? '/inventories/' + usedBy.value.trim() : null,
      category: '/inventory-categories/' + category.value.trim(),
      location: '/inventory-locations/' + location.value.trim(),
    };

    await saveInventory(payload);

    name.value = "";
    description.value = "";
    quantity.value = 1;
    state.value = "available";
    category.value = "";
    location.value = "";
    usedBy.value = "";
    buyAt.value = "";
    buyPrice.value = "";
    warrantyEndAt.value = "";

    success.value = true;
    emit("saved");
    emit('close');
  } catch (e) {
    console.error(e);
    error.value = "Impossible d'enregistrer l'objet d'inventaire.";
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <div class="inventory-form-container">
    <UiElementsLoader v-if="sending"/>

    <form class="inventory-form form" @submit.prevent="submitForm" v-show="!sending">
      <div class="form-row full">
        <div class="form-group">
          <label for="name">Nom*</label>
          <input id="name" v-model="name" name="name" type="text" required placeholder="Nom du produit">
        </div>
        <div class="form-group">
          <UiElementsFormSelect
              v-model="state"
              label="État"
              :options="stateOptions"
          />
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label for="quantity">Quantité*</label>
          <input id="quantity" v-model="quantity" name="quantity" type="number" required placeholder="Quantité">
        </div>
        <div class="form-group">
          <UiElementsFormSelect
              v-model="category"
              label="Catégorie"
              :options="categoryOptions"
          />
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <UiElementsFormSelect
              v-model="location"
              label="Emplacement"
              :options="locationOptions"
          />
        </div>
        <div class="form-group">
          <UiElementsFormSelect
              v-model="usedBy"
              label="Utilisé par (produit)"
              :options="usedByOptions"
          />
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label for="purchase_date">Date d'achat</label>
          <input id="purchase_date" v-model="buyAt" name="purchase_date" type="date" placeholder="Date d'achat">
        </div>
        <div class="form-group">
          <label for="purchase_price">Prix d'achat</label>
          <input id="purchase_price" v-model="buyPrice" name="purchase_price" type="text" placeholder="Prix d'achat">
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label for="warranty_end_date">Fin de garantie</label>
          <input id="warranty_end_date" v-model="warrantyEndAt" name="warranty_end_date" type="date"
                 placeholder="Fin de garantie">
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="description" name="description" placeholder="Détails (optionnel)"/>
        </div>
      </div>
      <div class="form-row">
        <button type="button" @click="emit('close')">Annuler</button>
        <button type="submit" :disabled="!isValid || sending">
          <UiIconsSave/>
          Enregistrer
        </button>
      </div>
    </form>
  </div>
</template>