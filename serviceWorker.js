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

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    alert("event.request.mode === navigate");
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
  } else if (
    event.request.method === "POST" &&
    event.request.url.endsWith("/receive-image")
  ) {
    alert("request.url.endsWith(/receive-image)")
    event.respondWith(handleImageShare(event.request));
  } else if (
    event.request.method === "POST" &&
    event.request.url.endsWith("./receive-image")
  ) {
    alert("request.url.endsWith(./receive-image)")
    event.respondWith(handleImageShare(event.request));
  }
});


// Function to handle the image share and respond with a success message
async function handleImageShare(request) {
  alert("handleImageShare");

  try {
    const formData = await request.formData();
    const image = formData.get("image");
    // Here, you can process the received image if needed (e.g., save to a database, etc.)
    return new Response("Image received successfully!", {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error handling image share:", error);
    return new Response("Error receiving the image.", {
      status: 500,
      statusText: "Internal Server Error",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}