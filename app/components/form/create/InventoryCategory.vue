<script setup lang="ts">
import {saveInventoryCategory} from "~/services/api.ts";

const emit = defineEmits<{
  saved: [];
}>();

const sending = ref(false);
const error = ref("");
const success = ref(false);

const name = ref("");

const isValid = computed(() => name.value.trim() !== "");

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    await saveInventoryCategory({
      name: name.value.trim()
    });

    name.value = "";

    success.value = true;
    emit("saved");
  } catch (e) {
    console.error(e);
    error.value = "Impossible d'enregistrer la catégorie de l'inventaire.";
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
        <div class="form-group name">
          <input id="name" v-model="name" name="name" type="text" required placeholder="Nouvelle catégorie">
        </div>
        <div class="form-group button">
          <button type="submit" :disabled="!isValid || sending"><UiIconsPlus /></button>
        </div>
      </div>

      <div v-if="error || success" class="form-row">
        <UiElementsFlashMessage v-if="error" :type="'error'">{{ error }}</UiElementsFlashMessage>
        <UiElementsFlashMessage v-if="success" :type="'success'">Une catégorie a été ajoutée.</UiElementsFlashMessage>
      </div>
    </form>
  </div>
</template>