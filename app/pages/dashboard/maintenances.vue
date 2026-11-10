<script setup lang="ts">
import { getMaintenances } from "~/services/api";

const { data, pending, error, refresh } = await useAsyncData(
    "maintenance-data",
    async () => {
      const maintenances = await getMaintenances();

      return { maintenances };
    },
    { deep: true }
);

const handleDeleted = (id: string) => {
  if (!data.value) return;

  data.value.maintenances = data.value.maintenances.filter(
      (maintenance) => maintenance.id !== id
  );
};

useHead({
  bodyAttrs: {
    class: "page-maintenance",
  },
});
</script>

<template>
  <UiElementsLoaderLogo v-if="pending"/>

  <div v-else-if="error" class="container">
    <p>Impossible de charger les maintenances.</p>
    <p>{{ error.message }}</p>
  </div>

  <div v-else class="container">
    <UiElementsHeader
        :title="'Maintenances'"
        :description="'Les entretiens à prévoir, leur fréquence et leur échéance'"
    />

    <div class="content">
      <section id="formulaire" class="formulaire">
        <FormCreateMaintenance @saved="refresh"/>
      </section>
      <section id="data" class="data">
        <div class="maintenances elements">
          <div class="maintenance-empty element-empty" v-if="data?.maintenances && data?.maintenances.length < 1">
            Aucune maintenance pour le moment
          </div>
          <ListingMaintenance
              v-else
              :maintenances="data?.maintenances ?? []"
              @deleted="handleDeleted"
              @refresh="refresh"
          />
        </div>
      </section>
    </div>
  </div>
</template>