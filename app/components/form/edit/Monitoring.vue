<script setup lang="ts">
import { updateMonitoring } from "~/services/api.ts";

const props = defineProps<{
  monitoring: Monitoring
}>();

const emit = defineEmits<{
  saved: [];
  cancel: [];
}>();

const sending = ref(false);
const error = ref("");
const success = ref(false);

const toForm = (monitoring: Monitoring) => ({
  name: monitoring.name,
  link: monitoring.link,
  active: monitoring.active
});

const form = ref(toForm(props.monitoring));

watch(() => props.monitoring, (monitoring) => {
  form.value = toForm(monitoring);
  success.value = false;
});

const isValid = computed(() => form.value.name.trim() !== "" && form.value.link !== "");

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    await updateMonitoring(props.monitoring.id, {
      name: form.value.name.trim(),
      link: form.value.link.trim()
    });

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible de modifier le suivi de ce site.";
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <div class="monitoring-form-container">
    <UiElementsLoader v-if="sending"/>

    <form class="monitoring-form form edit-form" @submit.prevent="submitForm" v-show="!sending">
      <div class="form-row full">
        <div class="form-group">
          <label for="name">Nom*</label>
          <input id="name" v-model="form.name" name="name" type="text" required placeholder="Nom du site">
        </div>
        <div class="form-group">
          <label for="link">Lien*</label>
          <input id="link" v-model="form.link" name="link" type="text" required placeholder="Lien du site">
        </div>
      </div>

      <div v-if="error || success" class="form-row">
        <UiElementsFlashMessage v-if="error" :type="'error'">{{ error }}</UiElementsFlashMessage>
        <UiElementsFlashMessage v-if="success" :type="'success'">Le suivi du site ajouté.</UiElementsFlashMessage>
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