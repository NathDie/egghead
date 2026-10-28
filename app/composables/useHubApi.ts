export const useHubApi = () => {
    const { public: { hubUrl, hubToken } } = useRuntimeConfig()

    return $fetch.create({
        baseURL: hubUrl,
        headers: {
            'hue-application-key': String(hubToken)
        }
    })
}