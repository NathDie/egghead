import type {
    HubLightManipulateResult,
    HubLightResult,
    HubOnPayload,
    HubRoomResult,
} from '~/types/hub_models'

export function useHubService() {
    const hubApi = useHubApi()

    return {
        getRooms: () => hubApi<HubRoomResult>('/rooms'),
        getLights: () => hubApi<HubLightResult>('/lights'),
        manipulateLight: (id: string, body: HubOnPayload) =>
            hubApi<HubLightManipulateResult>(`/lights/${id}`, {
                method: 'PUT',
                body,
            }),
        manipulateRoom: (groupedLightId: string, body: HubOnPayload) =>
            hubApi<HubLightManipulateResult>(`/grouped-lights/${groupedLightId}`, {
                method: 'PUT',
                body,
            }),
    }
}