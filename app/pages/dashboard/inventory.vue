<script setup lang="ts">
const pending = ref(false)
const data = ref(['toto', 'titi'])
const error = ref(false)

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
          <UiIconsSettings2 />
          Catégories & lieux
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