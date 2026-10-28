export default defineNuxtRouteMiddleware(() => {
    const auth = useAuthStore();
    if (!auth.isCaptain) return navigateTo('/dashboard');
});