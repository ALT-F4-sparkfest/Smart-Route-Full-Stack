import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null, // we register manually via usePwaUpdate so we control the update UX
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "BUSINA - Smart Route",
        short_name: "BUSINA",
        description: "Real-time public transport tracking",
        theme_color: "#FF6B00",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        // Long-press the app icon to jump straight into a mode,
        // skipping the landing page.
        shortcuts: [
          {
            name: "Track a Jeepney",
            short_name: "Commuter",
            description: "Open commuter map and ETA",
            url: "/?mode=commuter",
            icons: [{ src: "/icon-192.png", sizes: "192x192" }],
          },
          {
            name: "Fleet Dashboard",
            short_name: "Operator",
            description: "Open the operator fleet dashboard",
            url: "/?mode=operator",
            icons: [{ src: "/icon-192.png", sizes: "192x192" }],
          },
        ],
      },
      workbox: {
        // Precache the built app shell as before, plus define
        // runtime strategies for things generateSW can't precache.
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        navigateFallback: "/index.html",
        // Don't let navigateFallback swallow API or socket requests
        navigateFallbackDenylist: [/^\/api\//, /^\/socket\.io\//],
        runtimeCaching: [
          {
            // Google Maps JS API + tiles: NetworkFirst so the freshest
            // map loads when online, falling back to cache offline.
            urlPattern: ({ url }) =>
              url.hostname.includes("maps.googleapis.com") ||
              url.hostname.includes("maps.gstatic.com"),
            handler: "NetworkFirst",
            options: {
              cacheName: "google-maps-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Your own REST API: StaleWhileRevalidate so the map can
            // render last-known vehicle positions instantly, then
            // update once a fresh response lands.
            urlPattern: ({ url }) => url.pathname.startsWith("/vehicles"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "vehicles-api-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Demand hotspots / static data endpoints, same idea but
            // longer TTL since they change less often.
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/commuter/waiting"),
            handler: "NetworkFirst",
            options: {
              cacheName: "waiting-api-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 2,
              },
            },
          },
        ],
      },
    }),
  ],
});
