<script setup lang="ts">
import {saveInventoryLocation} from "~/services/api.ts";

const emit = defineEmits<{
  saved: [];
}>();

const sending = ref(false);
const error = ref("");
const success = ref(false);

const name = ref("");
const description = ref("");

const isValid = computed(() => name.value.trim() !== "");

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    await saveInventoryLocation({
      name: name.value.trim(),
      description: description.value.trim()
    });

    name.value = "";
    description.value = "";

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible d'enregistrer la localisation.";
  } finally {
    sending.value = false;
  }
};
</script>

<template>
  <div class="inventory-category-form-container">
    <UiElementsLoader v-if="sending"/>

    <form class="inventory-category-form form" @submit.prevent="submitForm" v-show="!sending">
      <div class="form-row full">
        <div class="form-group">
          <label for="name">Nom*</label>
          <input id="name" v-model="name" name="name" type="text" required placeholder="Nouveau lieu">
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <label for="description">Description*</label>
          <textarea id="description" v-model="description" name="description" placeholder="Détails (optionnel)" />
        </div>
      </div>

      <div v-if="error || success" class="form-row">
        <UiElementsFlashMessage v-if="error" :type="'error'">{{ error }}</UiElementsFlashMessage>
        <UiElementsFlashMessage v-if="success" :type="'success'">Un lieu a été ajouté.</UiElementsFlashMessage>
      </div>

      <div class="form-row full">
        <div class="form-group">
          <button type="submit" :disabled="!isValid || sending">
            <UiIconsPlus />
            Ajouter un lieu
          </button>
        </div>
      </div>
    </form>
  </div>
</template>