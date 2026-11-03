<script setup lang="ts">
import {getTasks, deleteTask} from "~/services/api.ts";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const { data, pending, error, refresh } = await useAsyncData("home-data", async () => {
  const [tasks] = await Promise.all([
    getTasks(),
  ]);

  return { tasks };
});

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

useHead({
  bodyAttrs: {
    class: "page-task",
  },
});
</script>

<template>
  <UiElementsLoaderLogo v-if="pending" />

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
        <FormTask @saved="refresh" />
      </section>
      <section id="data" class="data">
        <div class="tasks">
          <div class="task-empty" v-if="data?.tasks && data?.tasks.length < 1">
            Aucun rappel pour le moment
          </div>
          <div
              v-else
              v-for="task in data?.tasks"
              :key="task.id"
              class="task"
          >
            <UiElementsLoader v-show="deletingId === task.id" />

            <div class="top">
              <h2>{{ task.title }}</h2>
              <p>{{ task.description }}</p>
            </div>

            <div class="bottom">
              <div class="priority" :class="task.priority">
                <UiIconsFlag />
                <span>{{ task.priority }}</span>
              </div>

              <div class="due-date">
                <UiIconsCalendar />
                <span>{{ formatDate(task.due_date) }}</span>
              </div>

              <button
                  type="button"
                  class="delete"
                  :disabled="deletingId === task.id"
                  @click="handleDelete(task.id)"
              >
                <UiIconsTrash />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>