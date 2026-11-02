<script setup lang="ts" generic="T extends string | number">
const props = defineProps<{
  options: { value: T; label: string }[];
  label?: string;
}>();

const model = defineModel<T>();

const root = useTemplateRef<HTMLElement>("root");
const isOpen = ref(false);

const selectedLabel = computed(
    () => props.options.find((option) => option.value === model.value)?.label,
);

function select(value: T) {
  model.value = value;
  isOpen.value = false;
}

function onClickOutside(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) isOpen.value = false;
}

onMounted(() => document.addEventListener("click", onClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", onClickOutside));
</script>

<template>
  <div ref="root" class="select">
    <span v-if="label" class="select-label">{{ label }}*</span>

    <button type="button" class="select-trigger" @click="isOpen = !isOpen">
      {{ selectedLabel }}
    </button>

    <ul v-show="isOpen" class="select-list">
      <li v-for="option in options" :key="option.value">
        <button
            type="button"
            class="select-option"
            :class="{ 'is-selected': option.value === model }"
            @click="select(option.value)"
        >
          {{ option.label }}
          <span v-if="option.value === model">✓</span>
        </button>
      </li>
    </ul>
  </div>
</template>