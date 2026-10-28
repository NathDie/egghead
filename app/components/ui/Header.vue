<script setup lang="ts">
const auth = useAuthStore();

async function signOut() {
  auth.logout();
  await navigateTo('/');
}
</script>

<template>
  <header>
    <div class="top">
      <div class="left-side">
        <div class="logo">
          <div class="icon">
            <UiIconsAnchor />
          </div>
          <div class="content">
            <strong>Punk Records</strong>
            <span>La maison connectée</span>
          </div>
        </div>
      </div>
      <div class="right-side">
        <p>{{ auth.payload?.username }}</p>
        <button @click="signOut" type="button">
          <UiIconsLogOut />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
    <div class="bottom">

      <nav>
        <NuxtLink to="/dashboard">
          <UiIconsCompass />
          <span>Accueil</span>
        </NuxtLink>
        <NuxtLink v-if="auth.isNakama" to="/dashboard/lamps">
          <UiIconsFlame />
          <span>Lampes</span>
        </NuxtLink>
        <NuxtLink v-if="auth.isCaptain" to="/dashboard/reminders">
          <UiIconsScrollText />
          <span>Rappels</span>
        </NuxtLink>
        <NuxtLink v-if="auth.isCaptain" to="/dashboard/tasks">
          <UiIconsSword />
          <span>Tâches</span>
        </NuxtLink>
        <NuxtLink v-if="auth.isCaptain" to="/dashboard/monitorings">
          <UiIconsTelescope />
          <span>Monitorings</span>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>