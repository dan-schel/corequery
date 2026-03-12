import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
    VitePWA({
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],

        // Let's always fetch the reset page from the server. Even though it can
        // be used to reset the service worker, so we shouldn't get stuck in a
        // broken state... idk! This is just in case I ever break the reset page
        // too, and need to patch it without worrying that users could be stuck
        // with the broken version cached.
        navigateFallbackDenylist: [/^\/reset\/?$/],
      },
      manifest: {
        // When running in production, before the server starts it replaces the
        // manifest.webmanifest file to overwrite these values. These values are
        // only seen when a demo app is running within this repo, in dev mode.
        name: "Demo App",
        short_name: "Demo App",
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
  assetsInclude: ["/reset.html"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, ".."),
    },
  },
});
