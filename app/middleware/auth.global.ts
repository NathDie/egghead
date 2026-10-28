export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore();
    auth.checkExpiration();

    if (!auth.isLoggedIn && to.path !== '/') return navigateTo('/');
    if (auth.isLoggedIn && to.path === '/') return navigateTo('/dashboard');
});