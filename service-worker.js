const CACHE_NAME = 'physics-demo-cache-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/manifest.json',
    '/static/js/main.js',
    '/static/js/liquidEvaporation.js',
    '/static/js/crystallization.js',
    '/static/js/solidMelting.js',
    '/static/js/gasLiquefaction.js',
    '/static/js/electromagneticConversion.js',
    '/static/js/lightInterference.js',
    '/static/js/soundDiffraction.js',
    '/static/js/waterSiphon.js',
    '/static/js/surfaceTension.js',
    '/static/js/lightReflectionRefraction.js'
];

self.addEventListener('install', event => {
    // Force this service worker to become active immediately
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache:', CACHE_NAME);
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())  // Take control of all open tabs
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request).then(fetchResponse => {
                // Cache new requests dynamically
                if (fetchResponse && fetchResponse.status === 200) {
                    const responseClone = fetchResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return fetchResponse;
            });
        })
    );
});
