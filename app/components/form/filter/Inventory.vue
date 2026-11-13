
<script setup lang="ts">
import type { InventoryFilters } from "~/types/models";

const props = defineProps<{
  categories: InventoryCategory[];
  locations: InventoryLocation[];
}>();

const emit = defineEmits<{
  change: [filters: InventoryFilters];
}>();

const search = ref("");
const currentCategory = ref("");
const currentLocation = ref("");
const currentState = ref("");

const stateOptions = [
  { value: "", label: "Tous les états" },
  { value: "available", label: "Disponible" },
  { value: "in_use", label: "En utilisation" },
  { value: "broken", label: "Cassé" },
  { value: "lost", label: "Perdu" }
];

const categoryOptions = computed(() => [
  { value: "", label: "Toutes les catégories" },
  ...props.categories.map(c => ({
    value: String(c.id),
    label: c.name
  }))
]);

const locationOptions = computed(() => [
  { value: "", label: "Tous les lieux" },
  ...props.locations.map(l => ({
    value: String(l.id),
    label: l.name
  }))
]);

watch(
    [search, currentState, currentCategory, currentLocation],
    () => {
      emit("change", {
        search: search.value,
        state: currentState.value,
        category: currentCategory.value,
        location: currentLocation.value
      });
    }
);
</script>

<template>
  <div class="inventory-filter-container">
    <form class="inventory-filter form">
      <div class="form-row">
        <div class="form-group">
          <input
              v-model="search"
              type="text"
              name="search"
              placeholder="Rechercher un produit..."
          />
        </div>

        <div class="form-group">
          <UiElementsFormSelect
              v-model="currentState"
              :options="stateOptions"
          />
        </div>

        <div class="form-group">
          <UiElementsFormSelect
              v-model="currentCategory"
              :options="categoryOptions"
          />
        </div>

        <div class="form-group">
          <UiElementsFormSelect
              v-model="currentLocation"
              :options="locationOptions"
          />
        </div>
      </div>
    </form>
  </div>
</template>
