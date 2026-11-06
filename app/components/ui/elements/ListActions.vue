<script setup lang="ts">
const openActions = useExclusiveOpen("list-actions");

const toggleOpenActions = () => {
  openActions.value = !openActions.value
}
</script>

<template>
  <div class="list-actions-container">
    <button class="main-button" @click="toggleOpenActions">
      <LazyUiIconsEllipsisVertical />
    </button>
    <div class="actions" :class="{show: openActions}">
      <slot name="actions" />
    </div>
  </div>
</template>