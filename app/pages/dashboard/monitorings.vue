<script setup lang="ts">
import {getMonitorings} from "~/services/api.ts";

const {data, pending, error, refresh} = await useAsyncData(
    "monitoring-data",
    async () => {
      const monitorings = await getMonitorings();
      return {monitorings};
    },
    {deep: true},
);

const handleDeleted = (id: string) => {
  if (!data.value) return;

  data.value.monitorings = data.value.monitorings.filter((monitoring) => monitoring.id !== id);
};

const handleActiveChanged = (id: string, active: boolean) => {
  const monitoring = data.value?.monitorings.find((monitoring) => monitoring.id === id);
  if (monitoring) monitoring.active = active;
};

useHead({
  bodyAttrs: {
    class: "page-monitoring",
  },
});
</script>

<template>
  <UiElementsLoaderLogo v-if="pending"/>

  <div v-else-if="error" class="container">
    <p>Impossible de charger les sites à surveiller.</p>
    <p>{{ error.message }}</p>
  </div>

  <div v-else class="container">
    <UiElementsHeader
        :title="'Monitorings'"
        :description="'Vos liens à surveiller'"
    />

    <div class="content">
      <section id="formulaire" class="formulaire">
        <FormCreateMonitoring @saved="refresh"/>
      </section>

      <section id="data" class="data">
        <ListingMonitoring
            :monitorings="data?.monitorings ?? []"
            @deleted="handleDeleted"
            @active-changed="handleActiveChanged"
            @refresh="refresh"
        />
      </section>
    </div>
  </div>
</template>