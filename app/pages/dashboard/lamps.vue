<script setup lang="ts">
import { useHubService } from "~/services/hubApi.ts";

const roomNames: Record<string, string> = {
  'entry': "Entrée",
  'bedroom': "Chambre",
  "living-room": "Salon",
  'kitchen': "Cuisine",
};

const getRoomName = (name: string) => {
  const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  return roomNames[slug] ?? name;
};

const hub = useHubService();

const { data, pending, error } = await useAsyncData("lights-data", async () => {
  const [rooms, lights] = await Promise.all([hub.getRooms(), hub.getLights()]);

  // A room lists devices; a light points to its device through owner.rid
  return rooms.data.map((room) => {
    const deviceIds = new Set((room.children ?? []).map((child) => child.rid));

    return {
      ...room,
      lights: lights.data.filter((light) => deviceIds.has(light.owner.rid)),
    };
  });
});

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

    <div class="content">
      <div v-for="room in data ?? []" :key="room.id" class="room-item">
        <div class="room-header">
          <h2>{{ getRoomName(room.metadata.name) }}</h2>
        </div>

        <div class="room-content">
          <div v-for="light in room.lights" :key="light.id" class="room-light">
            <h3>{{ light.metadata.name }}</h3>
          </div>
        </div>
      </div>

      <p v-if="!data?.length">Aucune pièce trouvée.</p>
    </div>
  </div>
</template>