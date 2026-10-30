<script setup lang="ts">
import { useHubService } from "~/services/hubApi.ts";
import type { HubLight } from "~/types/hub_models";

const hub = useHubService();

const { data, pending, error } = await useAsyncData(
    "lights-data",
    async () => {
      const [rooms, lights] = await Promise.all([hub.getRooms(), hub.getLights()]);

      return rooms.data.map((room) => {
        const deviceIds = new Set((room.children ?? []).map((child) => child.rid));

        return {
          ...room,
          lights: lights.data.filter((light) => deviceIds.has(light.owner.rid)),
        };
      });
    },
    { deep: true },
);

const pendingIds = ref<string[]>([]);
const toggleError = ref("");

function setPending(id: string, value: boolean) {
  pendingIds.value = value
      ? [...pendingIds.value, id]
      : pendingIds.value.filter((pendingId) => pendingId !== id);
}

function assertNoErrors(response: { errors: { description: string }[] }) {
  if (response.errors.length > 0) {
    throw new Error(response.errors.map((e) => e.description).join(", "));
  }
}

async function toggleLight(light: HubLight, checked: boolean) {
  const previous = light.on.on;

  light.on.on = checked;
  setPending(light.id, true);
  toggleError.value = "";

  try {
    assertNoErrors(await hub.manipulateLight(light.id, { on: { on: checked } }));
  } catch (e) {
    console.error(e);
    light.on.on = previous;
    toggleError.value = `Impossible de modifier « ${light.metadata.name} ».`;
  } finally {
    setPending(light.id, false);
  }
}

type RoomWithLights = NonNullable<typeof data.value>[number];

const onCount = (room: RoomWithLights) => room.lights.filter((light) => light.on.on).length;

const isRoomOn = (room: RoomWithLights) =>
    room.lights.length > 0 && room.lights.every((light) => light.on.on);

function roomSummary(room: RoomWithLights): string {
  const total = room.lights.length;
  if (total === 0) return "Aucune lampe";

  const on = onCount(room);
  return `${on} sur ${total} ${total > 1 ? "allumées" : "allumée"}`;
}

async function toggleRoom(room: RoomWithLights, checked: boolean) {
  const groupedLight = room.services.find((service) => service.rtype === "grouped_light");

  if (!groupedLight) {
    toggleError.value = `La pièce « ${room.metadata.name} » ne peut pas être commandée en une fois.`;
    return;
  }

  const previous = room.lights.map((light) => light.on.on);

  room.lights.forEach((light) => (light.on.on = checked));
  setPending(room.id, true);
  toggleError.value = "";

  try {
    assertNoErrors(await hub.manipulateRoom(groupedLight.rid, { on: { on: checked } }));
  } catch (e) {
    console.error(e);
    room.lights.forEach((light, index) => (light.on.on = previous[index] ?? false));
    toggleError.value = `Impossible de modifier la pièce « ${room.metadata.name} ».`;
  } finally {
    setPending(room.id, false);
  }
}

useHead({
  bodyAttrs: {
    class: "page-lamps",
  },
});
</script>

<template>
  <UiElementsLoaderLogo v-if="pending" />

  <div v-else-if="error" class="container">
    <p>Impossible de charger les pièces et les lampes.</p>
    <p>{{ error.message }}</p>
  </div>

  <div v-else class="container">
    <UiElementsHeader :title="'Mes pièces'" :description="'Allumez ou éteignez une lampe, ou toute une pièce d\'un seul l\'interrupteur.'" />

    <p v-if="toggleError" class="toggle-error" role="alert">{{ toggleError }}</p>

    <div class="content">
      <div v-for="room in data ?? []" :key="room.id" class="room-item">
        <div class="room-header">
          <div class="room-title">
            <h2>{{ room.metadata.name }}</h2>
            <p class="room-summary">{{ roomSummary(room) }}</p>
          </div>

          <div class="room-all">
            <span>Toute la pièce</span>
            <UiElementsToggleSwitcher
                :checked="isRoomOn(room)"
                :disabled="pendingIds.includes(room.id) || room.lights.length === 0"
                :label="`Allumer ou éteindre toute la pièce ${room.metadata.name}`"
                @change="toggleRoom(room, $event)"
            />
          </div>
        </div>

        <div class="room-content">
          <div v-for="light in room.lights" :key="light.id" class="room-light">
            <div class="room-light--content">
              <div class="icon" :class="{on: light.on.on}">
                <UiIconsFlame />
              </div>
              <div class="text">
                <h3>{{ light.metadata.name }}</h3>
                <p>{{ light.on.on ? 'Allumée' : 'Éteinte'}}</p>
              </div>
            </div>

            <UiElementsToggleSwitcher
                :checked="light.on.on"
                :disabled="pendingIds.includes(light.id)"
                :label="`Allumer ou éteindre ${light.metadata.name}`"
                @change="toggleLight(light, $event)"
            />
          </div>
        </div>
      </div>

      <p v-if="!data?.length">Aucune pièce trouvée.</p>
    </div>
  </div>
</template>