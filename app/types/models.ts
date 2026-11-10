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

export type ReminderUpdatePayload = Partial<Reminder>

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

interface TaskFields {
    title: string
    description: string
    status: string
    priority: string
    due_date: string
}

export interface Task extends TaskFields {
    id: string
}

export type TaskPayload = TaskFields

export type TaskUpdatePayload = Partial<TaskFields>

interface MaintenanceFields {
    title: string
    description: string
    frequency: string
    next_due_at: string
    last_done_at: string
}

export interface Maintenance extends  MaintenanceFields {
    id: string
    status: string
    logs: MaintenanceLog
}

export type MaintenancePayload = MaintenanceFields

export type MaintenanceUpdatePayload = Partial<MaintenanceFields>

interface MaintenanceLogFields {
    done_at: string
    note: string
}

export interface MaintenanceLog extends MaintenanceLogFields {
    id: string
}

export interface MaintenanceLogPayload extends MaintenanceLogFields {
    maintenance: string
}

export type MaintenanceLogUpdatePayload = Partial<MaintenanceFields>