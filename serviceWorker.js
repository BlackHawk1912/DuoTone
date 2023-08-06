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
  } else if (event.request.destination === "image") {
    // Intercept only fetch events for images
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

registerRoute("/share-file-handler", handleImageUpload, "POST");

async function handleImageUpload({ event }) {
  noImage = false;
  document.getElementById("button-container").style.display = "flex";
  const file = event.target.files[0];

  originalImage.onload = function () {
    const canvas = document.getElementById("duotoneCanvas");
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    const originalCanvas = document.getElementById("original-image");
    originalCanvas.width = originalImage.width;
    originalCanvas.height = originalImage.height;

    // Save the original image in the "originalImage" object
    originalCanvas.getContext("2d").drawImage(originalImage, 0, 0);

    // Apply the duotone effect to the "duotoneCanvas"
    Duotone(
      "duotoneCanvas",
      originalImage,
      document.getElementsByClassName("activeSwitch")[0].dataset.color1,
      document.getElementsByClassName("activeSwitch")[0].dataset.color2,
      document.getElementsByClassName("activeSwitch")[0].dataset.color3
    );
  };

  if (file) {
    const objectURL = URL.createObjectURL(file);
    originalImage.src = objectURL;
  }
}

importScripts: ["sw-next-message.js"],
          runtimeCaching: [
            {
              handler: ({ event }) => {
                const dataPromise = event.request.formData();
                event.waitUntil(
                  (async function () {
                    // defined in sw-next-message.js
                    await nextMessage("share-ready");
                    const client = await self.clients.get(
                      event.resultingClientId
                    );

                    const formData = await dataPromise;
                    client.postMessage({
                      images: formData.getAll("images") || [],
                      uri: "/share",
                    });
                  })()
                );
                return Response.redirect("/share");
              },
              urlPattern: "/share",
              method: "POST",
            },
          ],
