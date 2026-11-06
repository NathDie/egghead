<script setup lang="ts">
import {updateTask} from "~/services/api.ts";

const props = defineProps<{
  task: Task
}>();

const emit = defineEmits<{
  saved: [];
  cancel: [];
}>();

const sending = ref(false);
const error = ref("");
const success = ref(false);

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

const toForm = (task: Task) => ({
  title: task.title,
  due_date: task.due_date.slice(0, 10),
  description: task.description ?? "",
  status: task.status,
  priority: task.priority
});

const form = ref(toForm(props.task));

watch(() => props.task, (task) => {
  form.value = toForm(task);
  success.value = false;
});

const isValid = computed(() => form.value.title.trim() !== "" && form.value.due_date !== "");

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    await updateTask(props.task.id, {
      title: form.value.title.trim(),
      due_date: new Date(form.value.due_date).toISOString(),
      description: form.value.description.trim(),
      status: form.value.status,
      priority: form.value.priority
    });

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible de modifier la tâche.";
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <div class="task-form-container">
    <UiElementsLoader v-if="sending"/>

    <form class="task-form form edit-form" @submit.prevent="submitForm" v-show="!sending">
      <div class="form-row full">
        <div class="form-group">
          <label for="title">Titre*</label>
          <input id="title" v-model="form.title" name="title" type="text" required placeholder="Titre de la tâche">
        </div>
        <div class="form-group">
          <UiElementsFormSelect v-model="form.status" label="Récurrence" :options="statusOptions" />
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <UiElementsFormSelect v-model="form.priority" label="Récurrence" :options="priorityOptions" />
        </div>
        <div class="form-group">
          <label for="date">Échéance*</label>
          <input id="date" v-model="form.due_date" name="date" type="date" required>
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="form.description" name="description" placeholder="Détails (optionnel)"/>
        </div>
      </div>

      <div v-if="error || success" class="form-row">
        <UiElementsFlashMessage v-if="error" :type="'error'">{{ error }}</UiElementsFlashMessage>
        <UiElementsFlashMessage v-if="success" :type="'success'">Tâche ajoutée.</UiElementsFlashMessage>
      </div>

      <div class="form-row actions">
        <button type="button" @click="emit('cancel')">Annuler</button>
        <button type="submit" :disabled="!isValid || sending">
          <UiIconsSave /> Enregistrer
        </button>
      </div>
    </form>
  </div>
</template>