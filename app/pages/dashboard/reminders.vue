```vue
<script setup lang="ts">
import { getReminders, deleteReminder } from "~/services/api.ts";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const { data, pending, error } = await useAsyncData("home-data", async () => {
  const [reminders] = await Promise.all([
    getReminders(),
  ]);

  return { reminders };
});

const deletingId = ref<number | string | null>(null);

const handleDelete = async (id: number | string) => {
  if (deletingId.value !== null) return;

  deletingId.value = id;

  try {
    await deleteReminder(id);

    if (data.value?.reminders) {
      data.value.reminders = data.value.reminders.filter(
          (reminder) => reminder.id !== id
      );
    }
  } catch (err) {
    console.error("Impossible de supprimer le rappel :", err);
  } finally {
    deletingId.value = null;
  }
};

useHead({
  bodyAttrs: {
    class: "page-reminder",
  },
});
</script>

<template>
  <UiElementsLoaderLogo v-if="pending" />

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
      <div class="reminders">
        <div class="reminder-empty" v-if="data?.reminders && data?.reminders.length < 1">
          Aucun rappel pour le moment
        </div>
        <div
            v-else
            v-for="reminder in data?.reminders"
            :key="reminder.id"
            class="reminder"
        >
          <UiElementsLoader v-show="deletingId === reminder.id" />

          <div class="top">
            <h2>{{ reminder.title }}</h2>
            <p>{{ reminder.description }}</p>
          </div>

          <div class="bottom">
            <div class="remind">
              <UiIconsCalendar />
              <span>{{ formatDate(reminder.remind_at) }}</span>
            </div>

            <div class="recurring">
              <UiIconsRepeat />
              <span>{{ reminder.recurring }}</span>
            </div>

            <button
                type="button"
                :disabled="deletingId === reminder.id"
                @click="handleDelete(reminder.id)"
            >
              <UiIconsTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>