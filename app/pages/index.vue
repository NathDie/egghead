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
    await auth.login({ username: username.value, password: password.value });
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
  <main class="login">
    <form class="card" @submit.prevent="submit">
      <h1>Sign in</h1>

      <label>
        Username
        <input v-model="username" type="text" autocomplete="username" required autofocus />
      </label>

      <label>
        Password
        <input v-model="password" type="password" autocomplete="current-password" required />
      </label>

      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.login {
  --bg: #f5f6f8;
  --card: #ffffff;
  --text: #1c1e21;
  --muted: #5f6368;
  --border: #d5d8dd;
  --accent: #2f6fed;
  --danger: #d93025;

  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: var(--bg);
  color: var(--text);
}

@media (prefers-color-scheme: dark) {
  .login {
    --bg: #14161a;
    --card: #1d2026;
    --text: #e8eaed;
    --muted: #9aa0a6;
    --border: #3a3f47;
    --accent: #6c9bff;
    --danger: #f28b82;
  }
}

.card {
  width: 100%;
  max-width: 22rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.75rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

h1 {
  margin: 0;
  font-size: 1.25rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--muted);
}

input {
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

input:focus {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.error {
  margin: 0;
  font-size: 0.85rem;
  color: var(--danger);
}

button {
  padding: 0.65rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: wait;
}
</style>