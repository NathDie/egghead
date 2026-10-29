<script setup lang="ts">
const props = defineProps<{
  checked: boolean;
  label: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  change: [checked: boolean];
}>();

const input = useTemplateRef<HTMLInputElement>("input");

async function onChange(event: Event) {
  emit("change", (event.target as HTMLInputElement).checked);

  await nextTick();
  if (input.value) input.value.checked = props.checked;
}
</script>

<template>
  <label class="toggle" :class="{ 'is-disabled': disabled }">
    <input
        ref="input"
        class="toggle-input"
        type="checkbox"
        role="switch"
        :checked="checked"
        :disabled="disabled"
        :aria-label="label"
        @change="onChange"
    />

    <span class="toggle-track" aria-hidden="true">
      <span class="toggle-thumb" />
    </span>
  </label>
</template>