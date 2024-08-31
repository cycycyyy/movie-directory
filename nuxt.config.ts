// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "dayjs-nuxt", "@vueuse/motion/nuxt", '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      TMDB_API_URL: process.env.TMDB_API_URL,
      TMDB_API_KEY: process.env.TMDB_API_KEY,
    },
  },
});
