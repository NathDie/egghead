import type {AuthPayload, AuthResponse, ReminderPayload} from '~/types/models';

const authEndpoint = 'auth';
const reminderEndpoint = 'reminders'
const monitoringEndpoint = 'monitorings'

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

export async function saveReminder(payload: ReminderPayload) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Reminder>(`/${reminderEndpoint}`, {
        baseURL: config.public.apiUrl,
        method: 'POST',
        body: payload
    });
}

export async function getMonitorings() {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Monitoring[]>(`/${monitoringEndpoint}`, {
        baseURL: config.public.apiUrl,
        method: 'GET',
    });
}

export async function deleteMonitoring(id: string) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Monitoring>(`/${monitoringEndpoint}/${id}`, {
        baseURL: config.public.apiUrl,
        method: 'DELETE',
    });
}

export async function saveMonitoring(payload: MonitoringPayload) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Monitoring>(`/${monitoringEndpoint}`, {
        baseURL: config.public.apiUrl,
        method: 'POST',
        body: payload
    });
}

export async function updateMonitoring(id: string, payload: MonitoringUpdatePayload) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Monitoring>(`/${monitoringEndpoint}/${id}`, {
        baseURL: config.public.apiUrl,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json'
        },
        body: payload
    });
}