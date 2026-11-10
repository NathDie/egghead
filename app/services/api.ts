import type {
    AuthPayload,
    AuthResponse,
    MaintenanceLogPayload,
    ReminderPayload,
    ReminderUpdatePayload
} from '~/types/models';

const authEndpoint = 'auth';
const reminderEndpoint = 'reminders'
const monitoringEndpoint = 'monitorings'
const taskEndpoint = 'tasks'
const maintenanceEndpoint = 'maintenances'
const maintenanceLogEndpoint = 'maintenance-logs'

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

export async function updateReminder(id: string, payload: ReminderUpdatePayload) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Reminder>(`/${reminderEndpoint}/${id}`, {
        baseURL: config.public.apiUrl,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json'
        },
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

export async function getTasks() {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Task[]>(`/${taskEndpoint}`, {
        baseURL: config.public.apiUrl,
        method: 'GET',
    });
}

export async function deleteTask(id: string) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Task>(`/${taskEndpoint}/${id}`, {
        baseURL: config.public.apiUrl,
        method: 'DELETE',
    });
}

export async function saveTask(payload: TaskPayload) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Task>(`/${taskEndpoint}`, {
        baseURL: config.public.apiUrl,
        method: 'POST',
        body: payload
    });
}

export async function updateTask(id: string, payload: TaskUpdatePayload) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Task>(`/${taskEndpoint}/${id}`, {
        baseURL: config.public.apiUrl,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json'
        },
        body: payload
    });
}

export async function getMaintenances() {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Maintenance[]>(`/${maintenanceEndpoint}`, {
        baseURL: config.public.apiUrl,
        method: 'GET',
    });
}

export async function deleteMaintenance(id: string) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Maintenance>(`/${maintenanceEndpoint}/${id}`, {
        baseURL: config.public.apiUrl,
        method: 'DELETE',
    });
}

export async function saveMaintenance(payload: MaintenancePayload) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Maintenance>(`/${maintenanceEndpoint}`, {
        baseURL: config.public.apiUrl,
        method: 'POST',
        body: payload
    });
}

export async function updateMaintenance(id: string, payload: MaintenanceUpdatePayload) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<Maintenance>(`/${maintenanceEndpoint}/${id}`, {
        baseURL: config.public.apiUrl,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/merge-patch+json'
        },
        body: payload
    });
}

export async function deleteMaintenanceLog(id: string) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<MaintenanceLog>(`/${maintenanceLogEndpoint}/${id}`, {
        baseURL: config.public.apiUrl,
        method: 'DELETE',
    });
}

export async function saveMaintenanceLog(payload: MaintenanceLogPayload) {
    const config = useRuntimeConfig();
    const api = useApi()

    return api<MaintenanceLog>(`/${maintenanceLogEndpoint}`, {
        baseURL: config.public.apiUrl,
        method: 'POST',
        body: payload
    });
}