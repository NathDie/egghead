<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  type: {
    type: String as PropType<'error' | 'info' | 'success', 'warning'>,
    required: true,
  },
})

const messageClass = computed(() => {
  return [
    'flash-message',
    props.type,
  ]
})
</script>

<template>
  <div :class="messageClass">
    <slot />
  </div>
</template>

<style lang="scss">
.flash-message {
  text-align: center;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  width: 100%;
  border-radius: 16px;

  p {
    margin-bottom: 0;
  }

  &.error {
    background-color: #f8d7da;
    border: #f5c2c7 1px solid;
    color: #a94442;
  }

  &.warning {
    background-color: #fff3cd;
    border: #ffeeba 1px solid;
    color: #856404;
  }

  &.info {
    background-color: #d1ecf1;
    border: #bee5eb 1px solid;
    color: #0c5460;
  }

  &.success {
    background-color: #d4edda;
    border: #c3e6cb 1px solid;
    color: #155724;
  }
}

</style>
