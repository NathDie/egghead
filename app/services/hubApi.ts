import type { HubLightResult, HubRoomResult } from '~/types/hub_models'

const roomEndpoint = 'clip/v2/resource/room'
const lightEndpoint = 'clip/v2/resource/light'

export function useHubService() {
    const hubApi = useHubApi()

    return {
        getRooms: () => hubApi<HubRoomResult>(`/${roomEndpoint}`),
        getLights: () => hubApi<HubLightResult>(`/${lightEndpoint}`),
    }
}