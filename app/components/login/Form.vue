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
    error.value = status === 401 ? 'Invalid username or password.' : 'Unable to reach the server.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <label>
      Username
      <input v-model="username" type="text" autocomplete="username" required autofocus/>
    </label>

    <label>
      Password
      <input v-model="password" type="password" autocomplete="current-password" required/>
    </label>

    <UiElementsFlashMessage v-if="error" type="error">{{ error }}</UiElementsFlashMessage>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Signing in…' : 'Sign in' }}
    </button>
  </form>
</template>