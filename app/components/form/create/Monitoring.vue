<script setup lang="ts">
import {saveMonitoring} from "~/services/api.ts";

const emit = defineEmits<{
  saved: [];
}>();

const sending = ref(false);
const error = ref("");
const success = ref(false);

const name = ref("");
const link = ref("");

const isValid = computed(() => name.value.trim() !== "" && link.value !== "");

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    await saveMonitoring({
      name: name.value.trim(),
      link: link.value.trim(),
      active: true
    });

    name.value = "";
    link.value = "";

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible d'enregistrer la supervision.";
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <div class="monitoring-form-container">
    <UiElementsLoader v-if="sending"/>

    <form class="monitoring-form form" @submit.prevent="submitForm" v-show="!sending">
      <div class="form-row full">
        <div class="form-group">
          <label for="name">Nom*</label>
          <input id="name" v-model="name" name="name" type="text" required placeholder="Nom du site">
        </div>
        <div class="form-group">
          <label for="date">Lien*</label>
          <input id="date" v-model="link" name="link" type="text" required placeholder="Lien du site">
        </div>
      </div>

      <div v-if="error || success" class="form-row">
        <UiElementsFlashMessage v-if="error" :type="'error'">{{ error }}</UiElementsFlashMessage>
        <UiElementsFlashMessage v-if="success" :type="'success'">La supervision a été ajoutée.</UiElementsFlashMessage>
      </div>

      <div class="form-row">
        <button type="submit" :disabled="!isValid || sending">Ajouter une supervision</button>
      </div>
    </form>
  </div>
</template>