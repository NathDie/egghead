<script setup lang="ts">
const auth = useAuthStore();

useHead({
  bodyAttrs: {
    class: () => `page-dashboard`
  }
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Bonjour {{ auth.payload?.username }}</h1>
      <p>
        <template v-if="auth.isCaptain">
          Retrouvez ici vos tâches, vos rappels et l'état de vos services.
        </template>
        <template v-else>
          Retrouvez ici le contrôle de vos lampes.
        </template>
      </p>
    </div>
    <div class="content">
      <div class="navigation">
        <NuxtLink v-if="auth.isNakama" to="/dashboard/lamps" class="item">
          <div class="icon">
            <UiIconsFlame />
          </div>
          <div class="text">
            <h2>Lampes</h2>
            <p>Gestion de l'éclairage de la maison</p>
          </div>
          <UiIconsChevron  class="chevron" />
        </NuxtLink>
        <NuxtLink v-if="auth.isCaptain" to="/dashboard/reminders" class="item">
          <div class="icon">
            <UiIconsScrollText />
          </div>
          <div class="text">
            <h2>Rappels</h2>
            <p>Vos rappels, leur récurrence et leur date</p>
          </div>
          <UiIconsChevron  class="chevron" />
        </NuxtLink>
        <NuxtLink v-if="auth.isCaptain" to="/dashboard/tasks" class="item">
          <div class="icon">
            <UiIconsSword />
          </div>
          <div class="text">
            <h2>Tâches</h2>
            <p>Ce qu'il reste à faire, par priorité</p>
          </div>
          <UiIconsChevron  class="chevron" />
        </NuxtLink>
        <NuxtLink v-if="auth.isCaptain" to="/dashboard/monitorings" class="item">
          <div class="icon">
            <UiIconsTelescope />
          </div>
          <div class="text">
            <h2>Monitorings</h2>
            <p>Vos liens à surveiller</p>
          </div>
          <UiIconsChevron  class="chevron" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>