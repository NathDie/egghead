<script setup lang="ts">
import {getTasks, deleteTask, updateTask} from "~/services/api.ts";
import type {Task} from "~/types/models";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const statusOptions = [
  {value: "todo", label: "À faire"},
  {value: "in_progress", label: "En cours"},
  {value: "pending", label: "En attente"},
  {value: "done", label: "Terminé"},
  {value: "snoozed", label: "Reporté"},
  {value: "upcoming", label: "À venir"},
  {value: "overdue", label: "En retard"},
];

const {data, pending, error, refresh} = await useAsyncData(
    "home-data",
    async () => {
      const [tasks] = await Promise.all([
        getTasks(),
      ]);

      return {tasks};
    },
    {deep: true},
);

const deletingId = ref<number | string | null>(null);

const handleDelete = async (id: string) => {
  if (deletingId.value !== null) return;

  deletingId.value = id;

  try {
    await deleteTask(id);

    if (data.value?.tasks) {
      data.value.tasks = data.value.tasks.filter(
          (task) => task.id !== id
      );
    }
  } catch (err) {
    console.error("Impossible de supprimer la tâche :", err);
  } finally {
    deletingId.value = null;
  }
};

const updatingIds = ref<string[]>([]);
const statusError = ref("");

const handleStatusChange = async (task: Task, status: string) => {
  if (status === task.status || updatingIds.value.includes(task.id)) return;

  const previous = task.status;

  task.status = status;
  updatingIds.value = [...updatingIds.value, task.id];
  statusError.value = "";

  try {
    await updateTask(task.id, {status});
  } catch (err) {
    console.error("Impossible de modifier le statut :", err);
    task.status = previous;
    statusError.value = `Impossible de modifier le statut de « ${task.title} ».`;
  } finally {
    updatingIds.value = updatingIds.value.filter((id) => id !== task.id);
  }
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

    <p v-if="statusError" class="status-error" role="alert">{{ statusError }}</p>

    <div class="content">
      <section id="formulaire" class="formulaire">
        <FormCreateTask @saved="refresh"/>
      </section>
      <section id="data" class="data">
        <div class="tasks">
          <div class="task-empty" v-if="data?.tasks && data?.tasks.length < 1">
            Aucune tâche pour le moment
          </div>
          <div
              v-else
              v-for="task in data?.tasks"
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
                    :model-value="task.status"
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
                    <FormEditTask :task="task" @saved="refresh" @cancel="close"/>
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
      </section>
    </div>
  </div>
</template>