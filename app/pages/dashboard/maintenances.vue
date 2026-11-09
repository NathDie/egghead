<script setup lang="ts">
import {
  getMaintenances,
  deleteMaintenance,
  updateMaintenance,
  deleteMaintenanceLog,
  saveMaintenanceLog,
  getTasks, deleteTask
} from "~/services/api.ts";
import type {Maintenance, MaintenanceLog} from "~/types/models";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const recurrenceOptions = [
  { value: "none", label: "Aucune" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuelle" },
  { value: "quarterly", label: "Trimestrielle" },
  { value: "yearly", label: "Annuelle" },
];

const statusOptions = [
  { value: "up_to_date", label: "À jour" },
  { value: "todo", label: "À faire" },
  { value: "overdue", label: "En retard" },
];

const {data, pending, error, refresh} = await useAsyncData(
    "maintenance-data",
    async () => {
      const [maintenances] = await Promise.all([
        getMaintenances(),
      ]);

      return {maintenances};
    },
    {deep: true},
);

const deletingId = ref<number | string | null>(null);

const handleDelete = async (id: string) => {
  if (deletingId.value !== null) return;

  deletingId.value = id;

  try {
    await deleteTask(id);

    if (data.value?.maintenances) {
      data.value.maintenances = data.value.maintenances.filter(
          (maintenance) => maintenance.id !== id
      );
    }
  } catch (err) {
    console.error("Impossible de supprimer la maintenance :", err);
  } finally {
    deletingId.value = null;
  }
};
</script>

<template>
  <UiElementsLoaderLogo v-if="pending"/>

  <div v-else-if="error" class="container">
    <p>Impossible de charger les maintenances.</p>
    <p>{{ error.message }}</p>
  </div>

  <div v-else class="container">
    <UiElementsHeader
        :title="'Maintenances'"
        :description="'Les entretiens à prévoir, leur fréquence et leur échéance'"
    />

    <div class="content">
      <section id="formulaire" class="formulaire">
        <FormCreateTask @saved="refresh"/>
      </section>
      <section id="data" class="data">
        <div class="tasks">
          <div class="task-empty" v-if="data?.maintenances && data?.maintenances.length < 1">
            Aucune maintenance pour le moment
          </div>
          <div
              v-else
              v-for="maintenance in data?.maintenances"
              :key="maintenance.id"
              class="task"
          >
            <UiElementsLoader v-show="deletingId === maintenance.id"/>

            <div class="top">
              <h2>{{ maintenance.title }}</h2>
              <p v-if="maintenance.description">{{ maintenance.description }}</p>
            </div>

            <div class="bottom">
              <div class="status" :class="maintenance.status">
                {{ statusOptions.find(option => option.value === maintenance.status)?.label }}
              </div>

              <div class="frequency" v-if="maintenance.frequency">
                <UiIconsRepeat />
                {{ recurrenceOptions.find(option => option.value === maintenance.frequency)?.label }}
              </div>

              <div class="last-done-date" v-if="maintenance.last_done_at">
                <UiIconsCalendar />
                <span class="label">Fait le</span>
                <span>{{ formatDate(maintenance.last_done_at) }}</span>
              </div>

              <div class="next-due-date" v-if="maintenance.next_due_at">
                <UiIconsCalendarClock />
                <span class="label">Échéance</span>
                <span>{{ formatDate(maintenance.next_due_at) }}</span>
              </div>
            </div>

            <UiElementsListActions>
              <template #actions>
                <UiElementsModal :show-actions="false" :modal-title="'Modifier la maintenance'">
                  <template #modal-button>
                    <UiIconsPencil/>
                    Modifier
                  </template>
                  <template #modal-content="{ close }">
<!--                    <FormEditTask :task="task" @saved="refresh" @cancel="close"/>-->
                  </template>
                </UiElementsModal>
                <button
                    type="button"
                    class="delete"
                    :disabled="deletingId === maintenance.id"
                    @click="handleDelete(maintenance.id)"
                >
                  <UiIconsTrash/>
                  Supprimer
                </button>
              </template>
            </UiElementsListActions>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>