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
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        }
      ]
    }
  },
  devServer: {
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  },
});
