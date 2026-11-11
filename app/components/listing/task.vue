<script setup lang="ts">
import type {Task} from "~/types/models.ts";
import {deleteTask, updateTask} from "~/services/api.ts";

defineProps<{
  tasks: Task[];
}>();

const emit = defineEmits<{
  deleted: [id: string];
  statusChanged: [id: string, status: string];
  refresh: [];
}>();

const statusOptions = [
  {value: "todo", label: "À faire"},
  {value: "in_progress", label: "En cours"},
  {value: "pending", label: "En attente"},
  {value: "done", label: "Terminé"},
  {value: "snoozed", label: "Reporté"},
  {value: "upcoming", label: "À venir"},
  {value: "overdue", label: "En retard"},
];

const deletingId = ref<string | null>(null);

const handleDelete = async (id: string) => {
  if (deletingId.value !== null) return;

  deletingId.value = id;

  try {
    await deleteTask(id);
    emit("deleted", id);
  } catch (err) {
    console.error("Impossible de supprimer la tâche :", err);
  } finally {
    deletingId.value = null;
  }
};

const pendingStatus = ref<Record<string, string>>({});
const statusError = ref("");

const displayedStatus = (task: Task) => pendingStatus.value[task.id] ?? task.status;

const handleStatusChange = async (task: Task, status: string) => {
  if (status === displayedStatus(task) || task.id in pendingStatus.value) return;

  pendingStatus.value = {...pendingStatus.value, [task.id]: status};
  statusError.value = "";

  try {
    await updateTask(task.id, {status});
    emit("statusChanged", task.id, status);
  } catch (err) {
    console.error("Impossible de modifier le statut :", err);
    statusError.value = `Impossible de modifier le statut de « ${task.title} ».`;
  } finally {
    const {[task.id]: _done, ...rest} = pendingStatus.value;
    pendingStatus.value = rest;
  }
};
</script>

<template>
  <div class="tasks">
    <p v-if="statusError" class="status-error" role="alert">{{ statusError }}</p>

    <div class="task-empty" v-if="!tasks.length">
      Aucune tâche pour le moment
    </div>

    <div
        v-else
        v-for="task in tasks"
        :key="task.id"
        class="task"
    >
      <UiElementsLoader v-show="deletingId === task.id"/>

      <div class="top">
        <h2>{{ task.title }}</h2>
        <p>{{ task.description }}</p>
      </div>

      <div class="bottom">
        <div class="status">
          <UiElementsFormSelect
              :model-value="displayedStatus(task)"
              :options="statusOptions"
              @update:model-value="handleStatusChange(task, $event)"
          />
        </div>

        <div class="priority" :class="task.priority">
          <UiIconsFlag/>
          <span>{{ task.priority }}</span>
        </div>

        <div class="due-date">
          <UiIconsCalendar/>
          <span>{{ formatDate(task.due_date) }}</span>
        </div>
      </div>

      <UiElementsListActions>
        <template #actions>
          <UiElementsModal :show-actions="false" :modal-title="'Modifier la tâche'">
            <template #modal-button>
              <UiIconsPencil/>
              Modifier
            </template>
            <template #modal-content="{ close }">
              <FormEditTask :task="task" @saved="emit('refresh')" @cancel="close"/>
            </template>
          </UiElementsModal>
          <button
              type="button"
              class="delete"
              :disabled="deletingId === task.id"
              @click="handleDelete(task.id)"
          >
            <UiIconsTrash/>
            Supprimer
          </button>
        </template>
      </UiElementsListActions>
    </div>
  </div>
</template>