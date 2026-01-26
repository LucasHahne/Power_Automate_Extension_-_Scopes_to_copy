import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./public/manifest.json";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), crx({ manifest }), tailwindcss()],
  base: "./",
  server: {
    cors: {
      origin: "*",
      // origin: false
      credentials: false,
    },
    headers: {
      //  "X-Content-Type-Options": "nosniff",
      // "X-Frame-Options": "DENY",
      "Access-Control-Allow-Origin": "*",
    },
  },
});
