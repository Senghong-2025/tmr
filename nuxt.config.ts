// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  css: ["~/assets/main.css"],
  devtools: { enabled: true },
  modules: ["@primevue/nuxt-module"],
  plugins: ["~/plugins/firebase.ts"],
  vite: {
    plugins: [tailwindcss()],
  },
  primevue: {
    options: {
      ripple: true,
      inputVariant: "filled",
    },
  },
});
