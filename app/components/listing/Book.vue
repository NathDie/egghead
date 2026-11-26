<script setup lang="ts">
import {deleteBook} from "~/services/api.ts";

defineProps<{
  books: Book[]
  categories: BookCategory[]
  authors: BookAuthor[]
}>();

const emit = defineEmits<{
  deleted: [id: string];
  saved: [];
}>();

const deletingId = ref<string | null>(null);

const handleDelete = async (id: string) => {
  if (deletingId.value !== null) return;

  deletingId.value = id;
  await deleteBook(id)
  emit('deleted', id)
}

const handleSaved = () => {
  emit('saved')
}
</script>

<template>
  <div class="books-container">
    <div
        v-for="book in books"
        :key="book.id"
        class="book"
    >
      <div class="top">
        <h2>{{ book.title }}</h2>
      </div>
      <div class="bottom">

      </div>

      <UiElementsListActions>
        <template #actions>
          <button
              type="button"
              class="delete"
              :disabled="deletingId === book.id"
              @click="handleDelete(book.id)"
          >
            <UiIconsTrash/>
            Supprimer
          </button>
        </template>
      </UiElementsListActions>
    </div>
  </div>
</template>