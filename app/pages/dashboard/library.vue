<script setup lang="ts">
import {getBooks, getBookAuthors, getBookCategories} from "~/services/api.ts";

const {data, pending, error, refresh} = await useAsyncData(
    "book-data",
    async () => {
      const [books, authors, categories] = await Promise.all([
        getBooks(),
        getBookAuthors(),
        getBookCategories(),
      ]);

      return {books, authors, categories};
    },
    {deep: true},
);

useHead({
  bodyAttrs: {
    class: () => `page-inventory`
  }
})
</script>

<template>
  <UiElementsLoaderLogo v-if="pending && !data"/>

  <div v-else-if="error" class="container">
    <p>Impossible de charger la bibliothèque.</p>
    <p>{{ error.message }}</p>
  </div>

  <div v-else class="container">
    <div class="library-header">
      <UiElementsHeader
          :title="'Bibliothèque'"
          :description="'Vos livres, leurs auteurs, leurs catégories et vos lectures en cours.'"
      />
      <div class="actions">
        <UiElementsModal :show-actions="false" :modal-title="'Nouveau livre'"
                         :modal-class="'book-modal'" :button-class="'book'">
          <template #modal-button class="book">
            <UiIconsPlus/>
            Nouveau livre
          </template>
          <template #modal-content="{ close }">
            <FormCreateBook :categories="data?.categories ?? []"
                                 :authors="data?.authors ?? []" @close="close" @saved="refresh"/>
          </template>
        </UiElementsModal>
      </div>
    </div>
  </div>
</template>