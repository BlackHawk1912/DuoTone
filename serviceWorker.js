// This is the "Offline page" service worker

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

const CACHE = "pwabuilder-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "index.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.cacheFirst()
);

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })()
    );
  }
});
  
self.addEventListener("fetch", (event) => {
  // Intercept only fetch events for images
  if (event.request.destination === "image") {
    event.respondWith(handleImageFetch(event));
  }
});

async function handleImageFetch(event) {
  const response = await fetch(event.request);
  const blob = await response.blob();

  // Send the image blob to the client
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach((client) => {
    client.postMessage({
      type: "imageFetched",
      imageBlob: blob,
    });
  });

  return response;
}


import { registerRoute } from "workbox-routing";

registerRoute("/share", handleImageUpload, "POST");
