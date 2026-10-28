import type { AuthPayload, AuthResponse } from '~/types/models';

const authEndpoint = 'auth';

export async function login(payload: AuthPayload) {
    const config = useRuntimeConfig();

    return $fetch<AuthResponse>(`/${authEndpoint}`, {
        baseURL: config.public.apiUrl,
        method: 'POST',
        body: payload,
    });
}