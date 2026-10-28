<script setup lang="ts">
const auth = useAuthStore();

async function signOut() {
  auth.logout();
  await navigateTo('/');
}
</script>

<template>
  <main>
    <h1>Dashboard</h1>
    <p>Signed in as {{ auth.payload?.username }}</p>
    <p>Roles: {{ auth.roles.join(', ') }}</p>

    <nav>
      <NuxtLink v-if="auth.isNakama" to="/dashboard/lamps">Lamps</NuxtLink>
      <NuxtLink v-if="auth.isCaptain" to="/dashboard/tasks">Tasks</NuxtLink>
    </nav>

    <button @click="signOut">Sign out</button>
  </main>
</template>