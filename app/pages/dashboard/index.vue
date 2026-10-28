<script setup lang="ts">
const auth = useAuthStore();

useHead({
  bodyAttrs: {
    class: () => `page-dashboard`
  }
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Bonjour {{ auth.payload?.username }}</h1>
      <p>
        <template v-if="auth.isCaptain">
          Retrouvez ici vos tâches, vos rappels et l'état de vos services.
        </template>
        <template v-else>
          Retrouvez ici le contrôle de vos lampes.
        </template>
      </p>
    </div>
  </div>
</template>