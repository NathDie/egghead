<script setup lang="ts">
import {deleteBookAuthor} from "~/services/api.ts";

defineProps<{
  authors: BookAuthor[]
}>();

const emit = defineEmits<{
  deleted: [id: string];
  refresh: [];
}>();

const handleDelete = async (id: string) => {
  await deleteBookAuthor(id)
  emit('deleted', id)
}
</script>

<template>
  <div class="book-authors-container items-container">
    <div
      class="category item"
      v-for="author in authors"
      :key="author.id"
    >
      <span class="label">{{ author.name }}</span>

      <button @click="handleDelete(author.id)">
        <UiIconsTrash />
      </button>
    </div>
  </div>
</template>