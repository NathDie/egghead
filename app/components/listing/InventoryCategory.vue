<script setup lang="ts">
import {deleteInventoryCategory} from "~/services/api.ts";

defineProps<{
  categories: InventoryCategory[]
}>();

const emit = defineEmits<{
  deleted: [id: string];
  refresh: [];
}>();

const handleDelete = async (id: string) => {
  await deleteInventoryCategory(id)
  emit('deleted', id)
}
</script>

<template>
  <div class="maintenance-categories-container items-container">
    <div
      class="category item"
      v-for="category in categories"
      :key="category.id"
    >
      <span class="label">{{ category.name }}</span>

      <button @click="handleDelete(category.id)">
        <UiIconsTrash />
      </button>
    </div>
  </div>
</template>