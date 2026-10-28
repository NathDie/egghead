<script setup lang="ts">
const auth = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;

  try {
    await auth.login({username: username.value, password: password.value});
    await navigateTo('/dashboard');
  } catch (e) {
    const status = (e as { statusCode?: number }).statusCode;
    error.value = status === 401 ? 'Identifiant invalide.' : 'Impossible d\'accéder au serveur.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <label>
      Nom d'utilisateur
      <input v-model="username" type="text" autocomplete="username" required autofocus/>
    </label>

    <label>
      Mot de passe
      <input v-model="password" type="password" autocomplete="current-password" required/>
    </label>

    <UiElementsFlashMessage v-if="error" type="error">{{ error }}</UiElementsFlashMessage>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Connexion en cours…' : 'Connexion' }}
    </button>
  </form>
</template>