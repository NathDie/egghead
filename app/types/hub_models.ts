export interface HubRoomChildren {
    rid: string
    rtype: string
}

export interface HubRoomService {
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

export interface HubDimming {
    "brightness": number,
    "min_dim_level": number
}

export interface HubRoom {
    id: string
    children: HubRoomChildren[]
    services: HubRoomService[]
    metadata: HubMetaData
    type: string
}

export interface HubRoomResult {
    data: HubRoom[]
}

export interface HubLight {
    data: {
        id: string
        children: HubRoomChildren[]
        services: HubRoomService[]
        metadata: HubMetaData
        on: boolean
        dimming: HubDimming,
        type: string
    }
}

export interface HubLightResult {
    data: HubLight[]
}