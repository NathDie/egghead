<script setup lang="ts">
const isOpen = ref(false)

defineProps({
  modalClass: String,
  buttonClass: String,
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'open',
  'close',
  'confirm'
])

const openModal = () => {
  isOpen.value = true
  document.body.classList.add('no-scroll')
  emit('open')
}

const closeModal = () => {
  isOpen.value = false
  document.body.classList.remove('no-scroll')
  emit('close')
}

const confirmModal = () => {
  emit('confirm')
  closeModal()
}

defineExpose({
  openModal,
  closeModal,
})

onUnmounted(() => {
  document.body.classList.remove('no-scroll')
})
</script>

<template>
  <button type="button" @click="openModal" :class="buttonClass">
    <slot name="modal-button"></slot>
  </button>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="isOpen" class="modal-container">
        <div class="modal-overlay" @click="closeModal"></div>

        <div class="modal" role="dialog" aria-modal="true" @click.stop :class="modalClass">
          <div class="modal-header">
            <button type="button" @click="closeModal">X</button>
          </div>

          <div class="modal-content">
            <slot name="modal-content" :close="closeModal" />
          </div>

          <div class="modal-footer" v-show="showActions">
            <button type="button" @click="closeModal" class="btn btn-default">
              Annuler
            </button>
            <slot name="modal-action" :confirm="confirmModal" />
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>