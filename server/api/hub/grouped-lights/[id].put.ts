export default defineEventHandler(async (event) => {
    const id = getUuidParam(event)
    const body = await readOnPayload(event)

    return hubFetch(event, `/clip/v2/resource/grouped_light/${id}`, { method: 'PUT', body })
})