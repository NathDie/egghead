<script setup lang="ts">
import { updateMaintenance } from "~/services/api.ts";

const props = defineProps<{
  maintenance: Maintenance
}>();

const emit = defineEmits<{
  saved: [];
  cancel: [];
}>();

const sending = ref(false);
const error = ref("");
const success = ref(false);

const recurrenceOptions = [
  { value: "none", label: "Aucune" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuelle" },
  { value: "quarterly", label: "Trimestrielle" },
  { value: "yearly", label: "Annuelle" },
];

const toForm = (maintenance: Maintenance) => ({
  title: maintenance.title,
  next_due_at: maintenance.next_due_at.slice(0, 10),
  last_done_at: maintenance.last_done_at.slice(0, 10),
  description: maintenance.description ?? "",
  frequency: maintenance.frequency
});

const form = ref(toForm(props.maintenance));

watch(() => props.maintenance, (maintenance) => {
  form.value = toForm(maintenance);
  success.value = false;
});

const isValid = computed(() => form.value.title.trim() !== "" && form.value.last_done_at !== "" && form.value.next_due_at !== "");

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    await updateMaintenance(props.maintenance.id, {
      title: form.value.title.trim(),
      last_done_at: new Date(form.value.last_done_at).toISOString(),
      next_due_at: new Date(form.value.next_due_at).toISOString(),
      description: form.value.description.trim(),
      frequency: form.value.frequency
    });

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible de modifier la maintenance.";
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
          <label for="title">Titre*</label>
          <input id="title" v-model="form.title" name="title" type="text" required placeholder="Titre de la maintenance">
        </div>
        <div class="form-group">
          <UiElementsFormSelect v-model="form.frequency" label="Fréquence" :options="recurrenceOptions" />
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label for="last_done_date">Dernière réalisation*</label>
          <input id="last_done_date" v-model="form.last_done_at" name="last_done_date" type="date" required>
        </div>
        <div class="form-group">
          <label for="next_due_date">Prochaine échéance*</label>
          <input id="next_due_date" v-model="form.next_due_at" name="next_due_date" type="date" required>
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
        <UiElementsFlashMessage v-if="success" :type="'success'">La maintenance a été modifiée.</UiElementsFlashMessage>
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