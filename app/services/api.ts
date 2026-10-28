import type { AuthPayload, AuthResponse } from '~/types/models';

const authEndpoint = 'auth';
const reminderEndpoint = 'reminders'

export async function login(payload: AuthPayload) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<AuthResponse>(`/${authEndpoint}`, {
        baseURL: config.public.apiUrl,
        method: 'POST',
        body: payload,
    });
}

export async function getReminders() {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Reminder[]>(`/${reminderEndpoint}`, {
        baseURL: config.public.apiUrl,
        method: 'GET',
    });
}

export async function deleteReminder(id: string) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Reminder[]>(`/${reminderEndpoint}/${id}`, {
        baseURL: config.public.apiUrl,
        method: 'DELETE',
    });
}