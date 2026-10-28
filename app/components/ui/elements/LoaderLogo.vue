<script setup lang="ts">
</script>
<template>
  <div class="loader">
    <div class="loader__spinner">
      <NuxtImg
          loading="lazy"
          :src="'/img/logo.png'"
          :alt="'Loading'"
      />
    </div>
  </div>
</template>

<style lang="scss">
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--color-liberty-blue);
  z-index: 1000;

  &__spinner {
    height: 18rem;
    width: 18rem;
    border-radius: 50%;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      color: var(--color-white);
      animation: spin 4s linear infinite;
      display: inline-block;
      width: 100%;
      font-weight: bold;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>