<script setup lang="ts">
import {
  getMonitorings,
  deleteMonitoring,
  updateMonitoring
} from "~/services/api.ts";

const {data, pending, error, refresh} = await useAsyncData(
    "monitoring-data",
    async () => {
      const monitorings = await getMonitorings();
      return {monitorings};
    }
);

const deletingId = ref<string | null>(null);
const updatingId = ref<string | null>(null);

const handleMonitoringAlertActivation = async (monitoring: Monitoring) => {
  if (updatingId.value !== null) return;

  updatingId.value = monitoring.id;

  try {
    const newActiveState = !monitoring.active;

    await updateMonitoring(monitoring.id, {
      active: newActiveState
    });

    monitoring.active = newActiveState;

  } catch (err) {
    console.error("Impossible de gérer l'alerte :", err);
  } finally {
    updatingId.value = null;
  }
};

const handleDelete = async (id: string) => {
  if (deletingId.value !== null) return;

  deletingId.value = id;

  try {
    await deleteMonitoring(id);

    if (data.value?.monitorings) {
      data.value.monitorings = data.value.monitorings.filter(
          (monitoring) => monitoring.id !== id
      );
    }
  } catch (err) {
    console.error("Impossible de supprimer l'alerte :", err);
  } finally {
    deletingId.value = null;
  }
};

useHead({
  bodyAttrs: {
    class: "page-monitoring",
  },
});
</script>

<template>
  <UiElementsLoaderLogo v-if="pending"/>

  <div v-else-if="error" class="container">
    <p>Impossible de charger les sites à surveiller.</p>
    <p>{{ error.message }}</p>
  </div>

  <div v-else class="container">
    <UiElementsHeader
        :title="'Monitorings'"
        :description="'Vos liens à surveiller'"
    />

    <div class="content">
      <section id="formulaire" class="formulaire">
        <FormCreateMonitoring @saved="refresh"/>
      </section>

      <section id="data" class="data">
        <div class="monitorings elements">
          <div
              class="monitoring-empty element-empty"
              v-if="data?.monitorings && data.monitorings.length < 1"
          >
            Aucun lien à surveiller pour le moment
          </div>

          <div
              v-else
              v-for="monitoring in data?.monitorings"
              :key="monitoring.id"
              class="monitoring element"
              :class="{ disabled: !monitoring.active }"
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
                  :disabled="updatingId === monitoring.id"
                  @click="handleMonitoringAlertActivation(monitoring)"
              >
                <template>
                  <UiIconsBellOff v-if="!monitoring.active" />
                  <UiIconsBell v-else />
                </template>
                <span>
                  {{
                    updatingId === monitoring.id
                        ? 'Modification...'
                        : monitoring.active
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
                    <UiIconsPencil /> Modifier
                  </template>
                  <template #modal-content="{ close }">
                    <FormEditMonitoring :monitoring="monitoring" @saved="refresh" @cancel="close" />
                  </template>
                </UiElementsModal>

                <button
                    type="button"
                    class="delete"
                    :disabled="deletingId === monitoring.id"
                    @click="handleDelete(monitoring.id)"
                >
                  <UiIconsTrash/> Supprimer
                </button>
              </template>
            </UiElementsListActions>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
