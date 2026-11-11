<script setup lang="ts">
import type {Monitoring} from "~/types/models.ts";
import {deleteMonitoring, updateMonitoring} from "~/services/api.ts";

defineProps<{
  monitorings: Monitoring[];
}>();

const emit = defineEmits<{
  deleted: [id: string];
  activeChanged: [id: string, active: boolean];
  refresh: [];
}>();

const deletingId = ref<string | null>(null);

const handleDelete = async (id: string) => {
  if (deletingId.value !== null) return;

  deletingId.value = id;

  try {
    await deleteMonitoring(id);
    emit("deleted", id);
  } catch (err) {
    console.error("Impossible de supprimer l'alerte :", err);
  } finally {
    deletingId.value = null;
  }
};

const pendingActive = ref<Record<string, boolean>>({});
const toggleError = ref("");

const isActive = (monitoring: Monitoring) => pendingActive.value[monitoring.id] ?? monitoring.active;
const isUpdating = (monitoring: Monitoring) => monitoring.id in pendingActive.value;

const handleMonitoringAlertActivation = async (monitoring: Monitoring) => {
  if (isUpdating(monitoring)) return;

  const newActiveState = !monitoring.active;

  pendingActive.value = {...pendingActive.value, [monitoring.id]: newActiveState};
  toggleError.value = "";

  try {
    await updateMonitoring(monitoring.id, {active: newActiveState});
    emit("activeChanged", monitoring.id, newActiveState);
  } catch (err) {
    console.error("Impossible de gérer l'alerte :", err);
    toggleError.value = `Impossible de modifier l'alerte de « ${monitoring.name} ».`;
  } finally {
    const {[monitoring.id]: _done, ...rest} = pendingActive.value;
    pendingActive.value = rest;
  }
};
</script>

<template>
  <div class="monitorings elements">
    <p v-if="toggleError" class="toggle-error" role="alert">{{ toggleError }}</p>

    <div class="monitoring-empty element-empty" v-if="!monitorings.length">
      Aucun lien à surveiller pour le moment
    </div>

    <div
        v-else
        v-for="monitoring in monitorings"
        :key="monitoring.id"
        class="monitoring element"
        :class="{ disabled: !isActive(monitoring) }"
    >
      <UiElementsLoader v-show="deletingId === monitoring.id"/>

      <div class="top">
        <h2>{{ monitoring.name }}</h2>
        <p>
          <UiIconsTelescope/>
          {{ monitoring.link }}
        </p>
      </div>

      <div class="bottom">
        <button
            type="button"
            class="update-activation"
            :disabled="isUpdating(monitoring)"
            @click="handleMonitoringAlertActivation(monitoring)"
        >
          <UiIconsBellOff v-if="!isActive(monitoring)"/>
          <UiIconsBell v-else/>
          <span>
            {{
              isUpdating(monitoring)
                  ? 'Modification...'
                  : isActive(monitoring)
                      ? 'Alertes actives'
                      : 'Alertes coupées'
            }}
          </span>
        </button>
      </div>

      <UiElementsListActions>
        <template #actions>
          <UiElementsModal :show-actions="false" :modal-title="'Modifier l\'alerte'">
            <template #modal-button>
              <UiIconsPencil/>
              Modifier
            </template>
            <template #modal-content="{ close }">
              <FormEditMonitoring :monitoring="monitoring" @saved="emit('refresh')" @cancel="close"/>
            </template>
          </UiElementsModal>

          <button
              type="button"
              class="delete"
              :disabled="deletingId === monitoring.id"
              @click="handleDelete(monitoring.id)"
          >
            <UiIconsTrash/>
            Supprimer
          </button>
        </template>
      </UiElementsListActions>
    </div>
  </div>
</template>