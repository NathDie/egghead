<script setup lang="ts">
import {deleteInventoryLocation} from "~/services/api.ts";

defineProps<{
  locations: InventoryLocation[]
}>();

const emit = defineEmits<{
  deleted: [id: string];
  refresh: [];
}>();

const handleDelete = async (id: string) => {
  await deleteInventoryLocation(id)
  emit('deleted', id)
}
</script>

<template>
  <div class="maintenance-locations-container items-container">
    <div
      class="location item"
      v-for="location in locations"
      :key="location.id"
    >
      <span class="label">{{ location.name }}</span>
      <span v-if="location.description" class="description">{{ location.description }}</span>

      <button @click="handleDelete(location.id)">
        <UiIconsTrash />
      </button>
    </div>
  </div>
</template>