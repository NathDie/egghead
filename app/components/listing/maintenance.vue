<script setup lang="ts">
import {deleteMaintenance, deleteMaintenanceLog} from "~/services/api";
import type {Maintenance} from "~/types/models";

defineProps<{
  maintenances: Maintenance[];
}>();

const emit = defineEmits<{
  deleted: [id: string];
  logDeleted: [maitenanceId: string, logId: string]
  refresh: [];
}>();

const recurrenceOptions = [
  {value: "none", label: "Aucune"},
  {value: "weekly", label: "Hebdomadaire"},
  {value: "monthly", label: "Mensuelle"},
  {value: "quarterly", label: "Trimestrielle"},
  {value: "yearly", label: "Annuelle"},
];

const statusOptions = [
  {value: "up_to_date", label: "À jour"},
  {value: "todo", label: "À faire"},
  {value: "overdue", label: "En retard"},
];

const deletingId = ref<string | null>(null);
const deletingLogId = ref<string | null>(null);

const handleDelete = async (id: string) => {
  if (deletingId.value !== null) return;

  deletingId.value = id;

  try {
    await deleteMaintenance(id);

    emit("deleted", id);
  } catch (err) {
    console.error("Impossible de supprimer la maintenance :", err);
  } finally {
    deletingId.value = null;
  }
};

const handleDeleteLog = async (maintenanceId: string, logId: string) => {
  if (deletingLogId.value !== null) return;

  deletingLogId.value = logId;

  try {
    await deleteMaintenanceLog(logId);

    emit("logDeleted", maintenanceId, logId);
  } catch (err) {
    console.error("Impossible de supprimer l'intervention :", err);
  } finally {
    deletingLogId.value = null;
  }
};

const refreshing = async () => {
  try {
    emit('refresh');
  }catch (err) {
    console.error("Impossible de mettre à jour la liste des maintenances :", err);
  }
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};
</script>

<template>
  <div
      v-if="maintenances.length > 0"
      v-for="maintenance in maintenances"
      :key="maintenance.id"
      class="maintenance element"
  >
    <UiElementsLoader v-show="deletingId === maintenance.id"/>

    <div class="top">
      <h2>{{ maintenance.title }}</h2>
      <p v-if="maintenance.description">{{ maintenance.description }}</p>
    </div>

    <div class="bottom">
      <div class="status" :class="maintenance.status">
        {{ statusOptions.find(option => option.value === maintenance.status)?.label }}
      </div>

      <div class="frequency" v-if="maintenance.frequency">
        <UiIconsRepeat/>
        {{ recurrenceOptions.find(option => option.value === maintenance.frequency)?.label }}
      </div>

      <div class="last-done-date" v-if="maintenance.last_done_at">
        <UiIconsCalendar/>
        <span class="label">Fait le {{ formatDate(maintenance.last_done_at) }}</span>
      </div>

      <div class="next-due-date" v-if="maintenance.next_due_at">
        <UiIconsCalendarClock/>
        <span class="label">Échéance {{ formatDate(maintenance.next_due_at) }}</span>
      </div>
    </div>

    <UiElementsListActions>
      <template #actions>
        <UiElementsModal :show-actions="false" :modal-title="`Historique de la maintenance - ${maintenance.title}`" :modalClass="'log-modal'">
          <template #modal-button>
            <UiIconsHistory/>
            Historique
          </template>
          <template #modal-content="{ close }">
            <div class="logs-container">
              <FormCreateMaintenanceLog :maintenance="maintenance" @saved="refreshing" @cancel="close"/>
              <ListingMaintenanceLog :logs="maintenance.logs" :maintenance-id="maintenance.id" @deleted="handleDeleteLog" />
            </div>
          </template>
        </UiElementsModal>
        <UiElementsModal :show-actions="false" :modal-title="'Modifier la maintenance'">
          <template #modal-button>
            <UiIconsPencil/>
            Modifier
          </template>
          <template #modal-content="{ close }">
            <FormEditMaintenance :maintenance="maintenance" @saved="refreshing" @cancel="close"/>
          </template>
        </UiElementsModal>
        <button
            type="button"
            class="delete"
            :disabled="deletingId === maintenance.id"
            @click="handleDelete(maintenance.id)"
        >
          <UiIconsTrash/>
          Supprimer
        </button>
      </template>
    </UiElementsListActions>
  </div>
</template>