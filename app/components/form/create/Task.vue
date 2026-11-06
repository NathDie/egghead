<script setup lang="ts">
import {saveTask} from "~/services/api.ts";

const emit = defineEmits<{
  saved: [];
}>();

const sending = ref(false);
const error = ref("");
const success = ref(false);

const name = ref("");
const date = ref("");
const description = ref("");
const priority = ref("low");
const status = ref('todo');

const priorityOptions = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" }
];

const statusOptions = [
  { value: "todo", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "pending", label: "En attente" },
  { value: "done", label: "Terminé" },
  { value: "snoozed", label: "Reporté" },
  { value: "upcoming", label: "À venir" },
  { value: "overdue", label: "En retard" }
];

const isValid = computed(() => name.value.trim() !== "" && date.value !== "");

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    await saveTask({
      title: name.value.trim(),
      due_date: new Date(date.value).toISOString(),
      description: description.value.trim(),
      status: status.value,
      priority: priority.value
    });

    name.value = "";
    date.value = "";
    description.value = "";
    status.value = "todo";
    priority.value = "low";

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible d'enregistrer la tâche.";
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <div class="task-form-container">
    <UiElementsLoader v-if="sending"/>

    <form class="task-form form" @submit.prevent="submitForm" v-show="!sending">
      <div class="form-row full">
        <div class="form-group">
          <label for="name">Nom*</label>
          <input id="name" v-model="name" name="name" type="text" required placeholder="Nom de la tâche">
        </div>
        <div class="form-group">
          <UiElementsFormSelect v-model="status" label="Récurrence" :options="statusOptions" />
        </div>
        <div class="form-group">
          <UiElementsFormSelect v-model="priority" label="Récurrence" :options="priorityOptions" />
        </div>
        <div class="form-group">
          <label for="date">Échéance*</label>
          <input id="date" v-model="date" name="date" type="date" required>
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="description" name="description" placeholder="Détails (optionnel)"/>
        </div>
      </div>

      <div v-if="error || success" class="form-row">
        <UiElementsFlashMessage v-if="error" :type="'error'">{{ error }}</UiElementsFlashMessage>
        <UiElementsFlashMessage v-if="success" :type="'success'">Tâche ajoutée.</UiElementsFlashMessage>
      </div>

      <div class="form-row">
        <button type="submit" :disabled="!isValid || sending">Ajouter la tâche</button>
      </div>
    </form>
  </div>
</template>