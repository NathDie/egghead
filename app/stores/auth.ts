import { defineStore } from 'pinia';
import * as authService from '~/services/api';
import type { AuthPayload } from '~/types/models';

interface JwtPayload {
    username: string;
    roles: string[];
    exp: number;
}

const SESSION_SECONDS = 60 * 60 * 24 * 30;

function decodeJwt(token: string): JwtPayload | null {
    try {
        const part = token.split('.')[1];
        if (!part) return null;

        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
        return null;
    }
}

export const useAuthStore = defineStore('auth', () => {
    const token = useCookie<string | null>('punk-token', {
        sameSite: 'strict',
        maxAge: SESSION_SECONDS,
    });

    const payload = computed(() => (token.value ? decodeJwt(token.value) : null));
    const isLoggedIn = computed(() => !!payload.value);
    const roles = computed(() => payload.value?.roles ?? []);

    const isCaptain = computed(() => roles.value.includes('ROLE_CAPTAIN'));
    const isNakama = computed(() => isCaptain.value || roles.value.includes('ROLE_NAKAMA'));

    async function login(userPayload: AuthPayload): Promise<void> {
        const { token: jwt } = await authService.login(userPayload);
        token.value = jwt;
    }

    function logout(): void {
        token.value = null;
    }

    function checkExpiration(): void {
        if (payload.value && payload.value.exp * 1000 <= Date.now()) logout();
    }

    return { token, payload, isLoggedIn, roles, isCaptain, isNakama, login, logout, checkExpiration };
});