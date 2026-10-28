<script lang="ts"></script>

<template>
  <div class="form-loader">
    <div class="form-loader__spinner">
      <NuxtImg
        loading="lazy"
        :src="'/img/loader.gif'"
        :alt="'Loading'"
      />
    </div>
  </div>
</template>

<style lang="scss">
.form-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;

  &__spinner {
    img {
      width: 4rem;
    }
  }
}
</style>
