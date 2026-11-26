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

const handleCategoriesDeleted = (id: string) => {
  if (!data.value) return;

  data.value.categories = data.value.categories.filter((category) => category.id !== id);
};

const handleAuthorsDeleted = (id: string) => {
  if (!data.value) return;

  data.value.authors = data.value.authors.filter((author) => author.id !== id);
};

useHead({
  bodyAttrs: {
    class: () => `page-library`
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
        <UiElementsModal :show-actions="false" :modal-title="'Catégories & auteurs'"
                         :modal-class="'category-author-modal'" :button-class="'category-author'">
          <template #modal-button class="category-author">
            <UiIconsSettings2/>
            Catégories & Auteurs
          </template>
          <template #modal-content="{ close }">
            <div class="category-author-container">
              <div class="category-side">
                <span class="title">Catégories</span>
                <FormCreateBookCategory @saved="refresh" @cancel="close"/>
                <ListingBookCategory
                    :categories="data?.categories ?? []"
                    @deleted="handleCategoriesDeleted"
                    @refresh="refresh"/>
              </div>
              <div class="author-side">
                <span class="title">Auteurs</span>
                <FormCreateBookAuthor @saved="refresh" @cancel="close"/>
                <ListingBookAuthor
                    :authors="data?.authors ?? []"
                    @deleted="handleAuthorsDeleted"
                    @refresh="refresh"/>
              </div>
            </div>
          </template>
        </UiElementsModal>
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

    <div class="content">
      <section id="formulaire" class="formulaire">

      </section>
      <section id="data" class="data">
        <div class="elements">
          <div class="inventory-empty element-empty" v-if="data?.books && data?.books.length < 1">
            Aucun livre pour le moment
          </div>
          <ListingBook
              v-else
              :authors="data?.authors ?? []"
              :categories="data?.categories ?? []"
              :books="data?.books ?? []"
              @saved="refresh"
          />
        </div>
      </section>
    </div>
  </div>
</template>