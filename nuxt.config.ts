// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const pgNativeShim = fileURLToPath(
  new URL("./server/shims/pg-native.cjs", import.meta.url)
);

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  css: ["~/assets/main.css"],
  devtools: { enabled: true },
  modules: ["@primevue/nuxt-module", "@nuxtjs/color-mode"],
  colorMode: {
    classSuffix: "",
    preference: "light",
    fallback: "light",
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriver: process.env.DATABASE_DRIVER,
  },
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
    alias: {
      "pg-native": pgNativeShim,
    },
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
  // devServer: {
  //   host: "0.0.0.0",
  //   port: process.env.PORT ? Number(process.env.PORT) : 3000,
  // },
});
