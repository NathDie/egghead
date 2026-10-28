<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: () => `page-login`
  }
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Punk Records</h1>
      <p>La maison connectée</p>
    </div>
    <div class="content">
      <LoginForm />
    </div>
  </div>
</template>