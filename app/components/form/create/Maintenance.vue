<script setup lang="ts">
import {saveMaintenance} from "~/services/api.ts";

const emit = defineEmits<{
  saved: [];
}>();

const sending = ref(false);
const error = ref("");
const success = ref(false);

const title = ref("");
const lastDoneDate = ref("");
const nextDueDate = ref("");
const description = ref("");
const frequency = ref("none");

const recurrenceOptions = [
  { value: "none", label: "Aucune" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuelle" },
  { value: "quarterly", label: "Trimestrielle" },
  { value: "yearly", label: "Annuelle" },
];

const isValid = computed(() => title.value.trim() !== "" && lastDoneDate.value !== "" && nextDueDate.value !== "");

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    await saveMaintenance({
      title: title.value.trim(),
      last_done_at: new Date(lastDoneDate.value).toISOString(),
      next_due_at: new Date(nextDueDate.value).toISOString(),
      description: description.value.trim(),
      frequency: frequency.value
    });

    title.value = "";
    lastDoneDate.value = "";
    nextDueDate.value = "";
    description.value = "";
    frequency.value = "none";

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible d'enregistrer la maintenance.";
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
          <label for="title">Titre*</label>
          <input id="title" v-model="title" name="title" type="text" required placeholder="Titre de la tâche">
        </div>
        <div class="form-group">
          <UiElementsFormSelect v-model="frequency" label="Fréquence" :options="recurrenceOptions" />
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label for="last_done_date">Dernière réalisation*</label>
          <input id="last_done_date" v-model="lastDoneDate" name="last_done_date" type="date" required>
        </div>
        <div class="form-group">
          <label for="next_due_date">Prochaine échéance*</label>
          <input id="next_due_date" v-model="nextDueDate" name="next_due_date" type="date" required>
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
        <UiElementsFlashMessage v-if="success" :type="'success'">La maintenance a été ajoutée.</UiElementsFlashMessage>
      </div>

      <div class="form-row">
        <button type="submit" :disabled="!isValid || sending">Ajouter une maintenance</button>
      </div>
    </form>
  </div>
</template>