// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/image'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    },
  },

  devServer: {
    host: 'localhost.egghead.fr',
  },

  css: ['~/assets/scss/main.scss'],

  runtimeConfig: {
    hubUrl: '', // overridden by NUXT_HUB_URL
    hubToken: '', // overridden by NUXT_HUB_TOKEN
    public: {
      apiUrl: '', // overridden by NUXT_PUBLIC_API_URL
    },
  },
})
