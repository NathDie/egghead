export interface JwtPayload {
    username: string;
    roles: string[];
    exp: number;
}

export interface AuthPayload {
    username: string
    password: string
}

export interface AuthResponse {
    token: string;
}

export interface Reminder {
    id: string
    title: string
    remind_at: string
    description: string
    recurring: string
}

export interface ReminderPayload {
    title: string
    remind_at: string
    description: string
    recurring: string
}

interface MonitoringFields {
    name: string
    link: string
    active: boolean
}

export interface Monitoring extends MonitoringFields {
    id: string
}

export type MonitoringPayload = MonitoringFields

export type MonitoringUpdatePayload = Partial<MonitoringFields>