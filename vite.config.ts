import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { resolve } from "path";
import manifest from "./public/manifest.json";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest,
      // Inline content-script deps so shared chunks (e.g. browserAPI) are not
      // exposed as web_accessible_resources and module-preloaded across worlds.
      contentScripts: {
        standaloneFiles: ["src/content/contentScript.ts"],
      },
    }),
    tailwindcss(),
  ],
  base: "./",
  build: {
    // Avoid <link rel="modulepreload"> for extension chunks; Chrome warns on
    // cross-world preload mismatches for chrome-extension:// resources.
    modulePreload: false,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, "sidepanel.html"),
      },
    },
  },
  server: {
    cors: {
      //origin: "*",
      origin: false,
      credentials: false,
    },
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      //"Access-Control-Allow-Origin": "*",
    },
  },
});
