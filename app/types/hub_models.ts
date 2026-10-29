export interface HubError {
    description: string
}

export interface HubResponse<T> {
    errors: HubError[]
    data: T
}

export interface HubResourceRef {
    rid: string
    rtype: string
}

export interface HubMetaData {
    name: string
    archetype: string
}

export interface HubOn {
    on: boolean
}

export interface HubOnPayload {
    on: HubOn
}

export interface HubDimming {
    brightness: number
    min_dim_level?: number
}

export interface HubRoom {
    id: string
    children: HubResourceRef[]
    services: HubResourceRef[]
    metadata: HubMetaData
    type: string
}

export type HubRoomResult = HubResponse<HubRoom[]>

export interface HubLight {
    id: string
    owner: HubResourceRef
    metadata: HubMetaData
    on: HubOn
    dimming?: HubDimming
    type: string
}

export type HubLightResult = HubResponse<HubLight[]>

export type HubLightManipulateResult = HubResponse<HubResourceRef[]>