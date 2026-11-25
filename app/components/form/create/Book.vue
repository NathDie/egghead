<script setup lang="ts">
import {saveBook} from "~/services/api.ts";
import type {BookUpdateOrCreateFields} from "~/types/models.ts";

const props = defineProps<{
  categories: InventoryCategory[]
  authors: BookAuthor[]
}>();

const emit = defineEmits<{
  saved: [];
  close: [];
}>();

const sending = ref(false);
const error = ref("");
const success = ref(false);

const title = ref("");
const publishedAt = ref("");
const author = ref("");
const category = ref("");
const synopsis = ref("");
const reading = ref(false);

const categoryOptions = computed(() => [
  {value: "", label: "Aucune"},
  ...props.categories.map((c) => ({value: String(c.id), label: c.name}))
]);


const authorOptions  = computed(() => [
  {value: "", label: "Personne"},
  ...props.authors.map((i) => ({value: String(i.id), label: i.name})),
]);

const isValid = computed(() =>
    [title, category, author, publishedAt].every((field) => field.value.trim() !== "")
);

const submitForm = async () => {
  if (!isValid.value || sending.value) return;

  sending.value = true;
  error.value = "";
  success.value = false;

  try {
    const payload: BookUpdateOrCreateFields = {
      title: title.value.trim(),
      synopsis: synopsis.value.trim(),
      published_at: publishedAt.value,
      categories: ['/book-categories/' + category.value.trim()],
      author: '/book-authors/' + author.value.trim(),
      reading: reading.value
    };

    await saveBook(payload);

    title.value = "";
    synopsis.value = "";
    category.value = "";
    author.value = "";
    reading.value = false;
    publishedAt.value = "";

    success.value = true;
    emit("saved");
    emit('close');
  } catch (e) {
    console.error(e);
    error.value = "Impossible d'enregistrer le nouveau livre.";
  } finally {
    sending.value = false;
  }
};

function onReadingChange(value: boolean) {
  reading.value = value;
}
</script>

<template>
  <div class="book-form-container">
    <UiElementsLoader v-if="sending"/>

    <form class="book-form form" @submit.prevent="submitForm" v-show="!sending">
      <div class="form-row full">
        <div class="form-group">
          <label for="title">Titre*</label>
          <input id="title" v-model="title" name="title" type="text" required placeholder="Titre du livre">
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <UiElementsFormSelect
              v-model="author"
              label="Auteur"
              :options="authorOptions"
          />
        </div>
        <div class="form-group">
          <label for="published_at">Date de publication</label>
          <input id="published_at" v-model="publishedAt" name="published_at" type="text" placeholder="Date de publication">
        </div>
      </div>

      <div class="form-row full">
        <div class="form-group">
          <label for="synopsis">Synopsis</label>
          <textarea id="synopsis" v-model="synopsis" name="synopsis" placeholder="Résumé du livre (optionnel)"/>
        </div>
      </div>
      <div class="form-row full">
        <div class="form-group">
          <UiElementsToggleSwitcher
              :checked="reading"
              :label="`Livre lu ?`"
              @change="onReadingChange"
          />
        </div>
      </div>
      <div class="form-row">
        <button type="button" @click="emit('close')">Annuler</button>
        <button type="submit" :disabled="!isValid || sending">
          <UiIconsSave/>
          Enregistrer
        </button>
      </div>
    </form>
  </div>
</template>