import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
    VitePWA({
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg}"],
      },
      manifest: {
        // When running in production, before the server starts it replaces the
        // manifest.webmanifest file to overwrite these values. These values are
        // only seen when a demo app is running within this repo, in dev mode.
        name: "CoreQuery Demo App",
        short_name: "CoreQuery",
        description: "This is a CoreQuery demo app.",

        // The values below remain as they are, although the images at the
        // specified paths are replaced.
        theme_color: "#242933",
        background_color: "#242933",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
