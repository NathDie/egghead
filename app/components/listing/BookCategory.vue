<script setup lang="ts">
import {deleteBookCategory} from "~/services/api.ts";

defineProps<{
  categories: BookCategory[]
}>();

const emit = defineEmits<{
  deleted: [id: string];
  refresh: [];
}>();

const handleDelete = async (id: string) => {
  await deleteBookCategory(id)
  emit('deleted', id)
}
</script>

<template>
  <div class="book-categories-container items-container">
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