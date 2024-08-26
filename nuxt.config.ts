// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ["@nuxt/ui", 'dayjs-nuxt', '@vueuse/motion/nuxt']
})