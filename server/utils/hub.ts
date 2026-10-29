import type { H3Event } from 'h3'

export async function hubFetch<T>(
    event: H3Event,
    path: string,
    init: { method?: 'GET' | 'PUT'; body?: Record<string, unknown> } = {},
) {
    const { hubUrl, hubToken } = useRuntimeConfig(event)

    if (!hubUrl || !hubToken) {
        console.error('[hub] NUXT_HUB_URL or NUXT_HUB_TOKEN is empty')
        throw createError({
            statusCode: 500,
            statusMessage: 'NUXT_HUB_URL ou NUXT_HUB_TOKEN manquant dans le .env',
        })
    }

    try {
        return await $fetch<T>(path, {
            baseURL: hubUrl,
            method: init.method ?? 'GET',
            body: init.body,
            headers: { 'hue-application-key': hubToken },
        })
    } catch (e) {
        const error = e as { statusCode?: number; message?: string; data?: unknown }
        console.error('[hub] bridge call failed:', path, error.statusCode, error.message, error.data)
        throw createError({
            statusCode: 502,
            statusMessage: `Le pont Hue n'a pas répondu : ${error.message}`,
        })
    }
}

export function getUuidParam(event: H3Event, name = 'id'): string {
    const value = getRouterParam(event, name)

    if (!value || !/^[0-9a-f-]{36}$/i.test(value)) {
        throw createError({ statusCode: 400, statusMessage: 'Identifiant invalide' })
    }

    return value
}

export async function readOnPayload(event: H3Event): Promise<{ on: { on: boolean } }> {
    const body = await readBody<{ on?: { on?: unknown } }>(event)

    if (typeof body?.on?.on !== 'boolean') {
        throw createError({ statusCode: 400, statusMessage: 'Corps invalide' })
    }

    return { on: { on: body.on.on } }
}