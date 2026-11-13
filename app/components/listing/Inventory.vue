<script setup lang="ts">
import {deleteInventory} from "~/services/api.ts";

defineProps<{
  inventories: Inventory[]
  categories: InventoryCategory[]
  locations: InventoryLocation[]
}>();

const emit = defineEmits<{
  deleted: [id: string];
  saved: [];
}>();

const stateOptions = [
  {value: "available", label: "Disponible"},
  {value: "in_use", label: "En utilisation"},
  {value: "broken", label: "Cassé"},
  {value: "lost", label: "Perdu"}
];

const deletingId = ref<string | null>(null);

const handleDelete = async (id: string) => {
  if (deletingId.value !== null) return;

  deletingId.value = id;
  await deleteInventory(id)
  emit('deleted', id)
}

const handleSaved = () => {
  emit('saved')
}
</script>

<template>
  <div class="inventories-container">
    <div
        v-for="inventory in inventories"
        :key="inventory.id"
        class="inventory"
    >
      <div class="top">
        <h2>{{ inventory.name }}</h2>
        <p v-if="inventory.description">{{ inventory.description }}</p>
      </div>
      <div class="bottom">
        <div class="state card">
          {{ stateOptions.find(option => option.value === inventory.status)?.label }}
        </div>
        <div v-if="inventory.category" class="category card">
          <UiIconsTag /> {{ inventory.category.name }}
        </div>
        <div v-if="inventory.location" class="location card">
          <UiIconsMap /> {{ inventory.location.name }}
        </div>
        <div v-if="inventory.purchase_date" class="purchase-date card">
          <UiIconsWallet /> {{ formatDate(inventory.purchase_date) }} <span v-if="inventory.purchase_price">- {{ inventory.purchase_price }}€</span>
        </div>
        <div v-if="inventory.warranty_expires_at" class="warranty card">
          <UiIconsShieldCheck /> {{ formatDate(inventory.warranty_expires_at) }}
        </div>
        <div v-if="inventory.used_by" class="using card">
          <UiIconsCalendarClock /> Utilisé par {{ inventory.used_by.name }}
        </div>
      </div>

      <div class="quantity">
        <UiIconsPackage /> x{{ inventory.quantity }}
      </div>

      <UiElementsListActions>
        <template #actions>
          <UiElementsModal :show-actions="false" :modal-title="'Modifier le produit'">
            <template #modal-button>
              <UiIconsPencil/>
              Modifier
            </template>
            <template #modal-content="{ close }">
              <FormEditInventory :inventory="inventory" :categories="categories" :locations="locations" @saved="handleSaved" @cancel="close"/>
            </template>
          </UiElementsModal>
          <button
              type="button"
              class="delete"
              :disabled="deletingId === inventory.id"
              @click="handleDelete(inventory.id)"
          >
            <UiIconsTrash/>
            Supprimer
          </button>
        </template>
      </UiElementsListActions>
    </div>
  </div>
</template>