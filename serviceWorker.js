// This is the "Offline page" service worker

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "index.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// const CACHE = "pwabuilder-page";

// self.addEventListener("install", async (event) => {
//   event.waitUntil(
//     caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage))
//   );
// });

// if (workbox.navigationPreload.isSupported()) {
//   workbox.navigationPreload.enable();
// }

// self.addEventListener("fetch", (event) => {
//   if (event.request.mode === "navigate") {
//     event.respondWith(
//       (async () => {
//         try {
//           const preloadResp = await event.preloadResponse;

//           if (preloadResp) {
//             return preloadResp;
//           }

//           const networkResp = await fetch(event.request);
//           return networkResp;
//         } catch (error) {
//           const cache = await caches.open(CACHE);
//           const cachedResp = await cache.match(offlineFallbackPage);
//           return cachedResp;
//         }
//       })()
//     );
//   }
// });


addEventListener("fetch", (event) => {
  alert("service worker reached");
  if (event.request.method !== "POST") {
    return;
  }

  if (
    event.request.url.startsWith(
      "https://blackhawk1912.github.io/DuoTone/upload"
    ) === false
  ) {
    return;
  }

  event.respondWith(
    Response.redirect("https://blackhawk1912.github.io/DuoTone/output.html")
  );
  event.waitUntil(
    (async function () {
      alert("async function reached");
      const data = await event.request.formData();
      const client = await self.clients.get(
        event.resultingClientId || event.clientId
      );

      const file = data.get("file");
      client.postMessage({ file, action: "load-image" });
    })()
  );
});