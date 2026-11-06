<script setup lang="ts">
import { saveReminder } from "~/services/api.ts";

const emit = defineEmits<{
  saved: [];
}>();

const sending = ref(false);
const error = ref("");
const success = ref(false);

const title = ref("");
const date = ref("");
const description = ref("");
const recurrence = ref("none");

const recurrenceOptions = [
  { value: "none", label: "Aucune" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuelle" },
  { value: "quarterly", label: "Trimestrielle" },
  { value: "yearly", label: "Annuelle" },
];

const isValid = computed(() => title.value.trim() !== "" && date.value !== "");

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    await saveReminder({
      title: title.value.trim(),
      remind_at: new Date(date.value).toISOString(),
      description: description.value.trim(),
      recurring: recurrence.value,
    });

    title.value = "";
    date.value = "";
    description.value = "";
    recurrence.value = "none";

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible d'enregistrer le rappel.";
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <div class="reminder-form-container">
    <UiElementsLoader v-if="sending"/>

    <form class="reminder-form form" @submit.prevent="submitForm" v-show="!sending">
      <div class="form-row full">
        <div class="form-group">
          <label for="name">Titre*</label>
          <input id="title" v-model="title" name="title" type="text" required placeholder="Titre du rappel">
        </div>
        <div class="form-group">
          <label for="date">Date*</label>
          <input id="date" v-model="date" name="date" type="date" required>
        </div>
        <div class="form-group">
          <UiElementsFormSelect v-model="recurrence" label="Récurrence" :options="recurrenceOptions" />
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
        <UiElementsFlashMessage v-if="success" :type="'success'">Le rappel ajouté.</UiElementsFlashMessage>
      </div>

      <div class="form-row">
        <button type="submit" :disabled="!isValid || sending">Ajouter un rappel</button>
      </div>
    </form>
  </div>
</template>