<script setup lang="ts">
import {getTasks} from "~/services/api.ts";

const {data, pending, error, refresh} = await useAsyncData(
    "task-data",
    async () => {
      const [tasks] = await Promise.all([
        getTasks(),
      ]);

      return {tasks};
    },
    {deep: true},
);

const handleDeleted = (id: string) => {
  if (!data.value) return;

  data.value.tasks = data.value.tasks.filter((task) => task.id !== id);
};

const handleStatusChanged = (id: string, status: string) => {
  const task = data.value?.tasks.find((task) => task.id === id);
  if (task) task.status = status;
};

useHead({
  bodyAttrs: {
    class: "page-task",
  },
});
</script>

<template>
  <UiElementsLoaderLogo v-if="pending"/>

  <div v-else-if="error" class="container">
    <p>Impossible de charger les tâches.</p>
    <p>{{ error.message }}</p>
  </div>

  <div v-else class="container">
    <UiElementsHeader
        :title="'Tâches'"
        :description="'Vos tâches, leur statut et leur priorité'"
    />

    <div class="content">
      <section id="formulaire" class="formulaire">
        <FormCreateTask @saved="refresh"/>
      </section>
      <section id="data" class="data">
        <ListingTask
            :tasks="data?.tasks ?? []"
            @deleted="handleDeleted"
            @status-changed="handleStatusChanged"
            @refresh="refresh"
        />
      </section>
    </div>
  </div>
</template>