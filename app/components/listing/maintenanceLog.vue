<script setup lang="ts">
import type {MaintenanceLog} from "~/types/models";

const props = defineProps<{
  logs: MaintenanceLog[],
  maintenanceId: string
}>();

const emit = defineEmits<{
  deleted: [maintenanceId: string, id: string];
  refresh: [];
}>();

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const handleDelete = (id: string) => {
  emit('deleted', props.maintenanceId, id)
}
</script>

<template>
  <div class="maintenance-logs">
    <p class="log-empty" v-if="logs.length < 1">Aucune intervention enregistrée.</p>
    <template v-else>
      <div
          v-for="log in logs"
          :key="log.id"
          class="log"
      >
        <p class="date">{{ formatDate(log.done_at)}}</p>
        <p v-if="log.note" class="note">
          {{ log.note }}
        </p>

        <button @click="handleDelete(log.id)">
          <UiIconsTrash />
        </button>
      </div>
    </template>
  </div>
</template>