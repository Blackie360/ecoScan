/// <reference lib="webworker" />

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = "ecoscan-v1"

// Add list of files to cache here.
const FILES_TO_CACHE = ["/", "/scan", "/map", "/learn", "/community", "/profile", "/placeholder.svg"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching offline page")
      return cache.addAll(FILES_TO_CACHE)
    }),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key)
            return caches.delete(key)
          }
          return Promise.resolve()
        }),
      )
    }),
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match("/")
        })
      }),
    )
  } else {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }
          // For non-HTML requests, try the network first, falling back to
          // cache if the user is offline.
          return fetch(event.request).catch(() => {
            // If the request is for an image, you could return a placeholder
            if (
              event.request.url.includes(".jpg") ||
              event.request.url.includes(".png") ||
              event.request.url.includes(".svg")
            ) {
              return caches.match("/placeholder.svg")
            }
            return new Response("Network error")
          })
        })
      }),
    )
  }
})
