<script setup lang="ts">
import {getReminders} from "~/services/api.ts";

const {data, pending, error, refresh} = await useAsyncData("reminder-data", async () => {
  const [reminders] = await Promise.all([
    getReminders(),
  ]);

  return {reminders};
});

const handleDeleted = (id: number | string) => {
  if (!data.value) return;

  data.value.reminders = data.value.reminders.filter((reminder) => reminder.id !== id);
};

useHead({
  bodyAttrs: {
    class: "page-reminder",
  },
});
</script>

<template>
  <UiElementsLoaderLogo v-if="pending"/>

  <div v-else-if="error" class="container">
    <p>Impossible de charger les rappels.</p>
    <p>{{ error.message }}</p>
  </div>

  <div v-else class="container">
    <UiElementsHeader
        :title="'Rappels'"
        :description="'Vos rappels, leur récurrence et leur date'"
    />

    <div class="content">
      <section id="formulaire" class="formulaire">
        <FormCreateReminder @saved="refresh"/>
      </section>
      <section id="data" class="data">
        <ListingReminder
            :reminders="data?.reminders ?? []"
            @deleted="handleDeleted"
            @refresh="refresh"
        />
      </section>
    </div>
  </div>
</template>