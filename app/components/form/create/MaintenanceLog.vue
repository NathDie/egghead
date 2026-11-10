<script setup lang="ts">
import {saveMaintenanceLog} from "~/services/api.ts";

const props = defineProps<{
  maintenance: Maintenance
}>();

const emit = defineEmits<{
  saved: [];
}>();

const sending = ref(false);
const error = ref("");
const success = ref(false);

const note = ref("");
const date = ref("");

const isValid = computed(() => date.value !== "");

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    await saveMaintenanceLog({
      done_at: new Date(date.value).toISOString(),
      note: note.value.trim(),
      maintenance: '/maintenances/' + props.maintenance.id
    });

    date.value = "";
    note.value = "";

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible d'enregistrer l'intervention.";
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <div class="log-form-container">
    <UiElementsLoader v-if="sending"/>

    <form class="task-form form" @submit.prevent="submitForm" v-show="!sending">
      <div class="form-row full">
        <div class="form-group">
          <label for="done_at">Réalisé le*</label>
          <input id="done_at" v-model="date" name="done_at" type="date" required>
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label for="note">Note</label>
          <textarea id="note" v-model="note" name="note" placeholder="Ce qui a été fait (optionnel)"/>
        </div>
      </div>

      <div v-if="error || success" class="form-row">
        <UiElementsFlashMessage v-if="error" :type="'error'">{{ error }}</UiElementsFlashMessage>
        <UiElementsFlashMessage v-if="success" :type="'success'">Une intervention a été ajoutée.</UiElementsFlashMessage>
      </div>

      <div class="form-row">
        <button type="submit" :disabled="!isValid || sending">Ajouter une intervention</button>
      </div>
    </form>
  </div>
</template>