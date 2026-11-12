<script setup lang="ts">
import {getInventories, getInventoryCategories, getInventoryLocations, getTasks} from "~/services/api.ts";

const {data, pending, error, refresh} = await useAsyncData(
    "inventory-data",
    async () => {
      const [inventories, categories, locations] = await Promise.all([
        getInventories(),
        getInventoryCategories(),
        getInventoryLocations(),
      ]);

      return {inventories, categories, locations};
    },
    {deep: true},
);

const handleDeleted = (id: string) => {
  if (!data.value) return;

  data.value.categories = data.value.categories.filter((category) => category.id !== id);
};

useHead({
  bodyAttrs: {
    class: () => `page-inventory`
  }
})
</script>

<template>
  <UiElementsLoaderLogo v-if="pending && !data"/>

  <div v-else-if="error" class="container">
    <p>Impossible de charger l'inventaire.</p>
    <p>{{ error.message }}</p>
  </div>

  <div v-else class="container">
    <div class="inventory-header">
      <UiElementsHeader
          :title="'Inventaire'"
          :description="'Vos produits, leur état, leur catégorie et l\'endroit où ils sont rangés'"
      />
      <div class="actions">
        <button class="category-locate">
          <UiElementsModal :show-actions="false" :modal-title="'Catégories & lieux'">
            <template #modal-button>
              <UiIconsSettings2 />
              Catégories & lieux
            </template>
            <template #modal-content="{ close }">
              <FormCreateInventoryCategory @saved="refresh" @cancel="close"/>
              <ListingInventoryCategory
                  :categories="data?.categories ?? []"
                  @deleted="handleDeleted"
                  @refresh="refresh" />
            </template>
          </UiElementsModal>
        </button>
        <button class="product">
          <UiIconsPlus />
          Nouveau produit
        </button>
      </div>
    </div>

    <div class="content">
      <section id="formulaire" class="formulaire">
<!--        <FormCreateMaintenance @saved="refresh"/>-->
      </section>
      <section id="data" class="data">
        <div class="items elements">
        </div>
      </section>
    </div>
  </div>
</template>