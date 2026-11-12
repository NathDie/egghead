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

const handleCategoriesDeleted = (id: string) => {
  if (!data.value) return;

  data.value.categories = data.value.categories.filter((category) => category.id !== id);
};

const handleLocationsDeleted = (id: string) => {
  if (!data.value) return;

  data.value.locations = data.value.locations.filter((location) => location.id !== id);
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
        <UiElementsModal :show-actions="false" :modal-title="'Catégories & lieux'"
                         :modal-class="'category-locate-modal'" :button-class="'category-locate'">
          <template #modal-button class="category-locate">
            <UiIconsSettings2/>
            Catégories & lieux
          </template>
          <template #modal-content="{ close }">
            <div class="category-locate-container">
              <div class="category-side">
                <span class="title">Catégories</span>
                <FormCreateInventoryCategory @saved="refresh" @cancel="close"/>
                <ListingInventoryCategory
                    :categories="data?.categories ?? []"
                    @deleted="handleCategoriesDeleted"
                    @refresh="refresh"/>
              </div>
              <div class="location-side">
                <span class="title">Lieux</span>
                <FormCreateInventoryLocation @saved="refresh" @cancel="close"/>
                <ListingInventoryLocation
                    :locations="data?.locations ?? []"
                    @deleted="handleLocationsDeleted"
                    @refresh="refresh"/>
              </div>
            </div>
          </template>
        </UiElementsModal>

        <UiElementsModal :show-actions="false" :modal-title="'Nouveau produit'"
                         :modal-class="'inventory-modal'" :button-class="'product'">
          <template #modal-button class="product">
            <UiIconsPlus/>
            Nouveau produit
          </template>
          <template #modal-content="{ close }">
            <FormCreateInventory :locations="data?.locations ?? []" :categories="data?.categories ?? []" :inventories="data?.inventories ?? []" @close="close" @saved="refresh" />
          </template>
        </UiElementsModal>
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