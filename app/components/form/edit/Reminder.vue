<script setup lang="ts">
import { updateReminder } from "~/services/api.ts";

const props = defineProps<{
  reminder: Reminder
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


const toForm = (reminder: Reminder) => ({
  title: reminder.title,
  date: reminder.remind_at.slice(0, 10),
  description: reminder.description ?? "",
  recurring: reminder.recurring,
});

const form = ref(toForm(props.reminder));

watch(() => props.reminder, (reminder) => {
  form.value = toForm(reminder);
  success.value = false;
});

const isValid = computed(() => form.value.title.trim() !== "" && form.value.date !== "");

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    await updateReminder(props.reminder.id, {
      title: form.value.title.trim(),
      remind_at: new Date(form.value.date).toISOString(),
      description: form.value.description.trim(),
      recurring: form.value.recurring,
    });

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible de modifier le rappel.";
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
          <label for="name">Nom*</label>
          <input id="name" v-model="form.title" name="name" type="text" required placeholder="Nom du rappel">
        </div>
        <div class="form-group">
          <label for="date">Date*</label>
          <input id="date" v-model="form.date" name="date" type="date" required>
        </div>
        <div class="form-group">
          <UiElementsFormSelect v-model="form.recurring" label="Récurrence" :options="recurrenceOptions" />
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
        <UiElementsFlashMessage v-if="success" :type="'success'">Rappel modifié.</UiElementsFlashMessage>
      </div>

      <div class="form-row">
        <button type="button" class="btn btn-default" @click="emit('cancel')">Annuler</button>
        <button type="submit" :disabled="!isValid || sending">Modifier le rappel</button>
      </div>
    </form>
  </div>
</template>