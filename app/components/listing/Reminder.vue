<script setup lang="ts">
import type {Reminder} from "~/types/models.ts";
import {deleteReminder} from "~/services/api.ts";

defineProps<{
  reminders: Reminder[];
}>();

const emit = defineEmits<{
  deleted: [id: number | string];
  refresh: [];
}>();

const deletingId = ref<number | string | null>(null);

const handleDelete = async (id: number | string) => {
  if (deletingId.value !== null) return;

  deletingId.value = id;

  try {
    await deleteReminder(id);
    emit("deleted", id);
  } catch (err) {
    console.error("Impossible de supprimer le rappel :", err);
  } finally {
    deletingId.value = null;
  }
};
</script>

<template>
  <div class="reminders">
    <div class="reminder-empty" v-if="!reminders.length">
      Aucun rappel pour le moment
    </div>

    <div
        v-else
        v-for="reminder in reminders"
        :key="reminder.id"
        class="reminder"
    >
      <UiElementsLoader v-show="deletingId === reminder.id"/>

      <div class="top">
        <h2>{{ reminder.title }}</h2>
        <p>{{ reminder.description }}</p>
      </div>

      <div class="bottom">
        <div class="remind">
          <UiIconsCalendar/>
          <span>{{ formatDate(reminder.remind_at) }}</span>
        </div>

        <div class="recurring">
          <UiIconsRepeat/>
          <span>{{ reminder.recurring }}</span>
        </div>
      </div>

      <UiElementsListActions>
        <template #actions>
          <UiElementsModal :show-actions="false" :modal-title="'Modifier le rappel'">
            <template #modal-button>
              <UiIconsPencil/>
              Modifier
            </template>
            <template #modal-content="{ close }">
              <FormEditReminder :reminder="reminder" @saved="emit('refresh')" @cancel="close"/>
            </template>
          </UiElementsModal>
          <button
              type="button"
              class="delete"
              :disabled="deletingId === reminder.id"
              @click="handleDelete(reminder.id)"
          >
            <UiIconsTrash/>
            Supprimer
          </button>
        </template>
      </UiElementsListActions>
    </div>
  </div>
</template>