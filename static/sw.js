var cachedFiles = [
    '/index.min.css',
    '/index.min.js',
    '/',
    'https://yastatic.net/jquery/3.1.0/jquery.min.js'
];
var cacheName = 'bem-forum';

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Installing');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(cachedFiles);
    })
  );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activation');
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.map(function(key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
                return key;
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetching ', e.request.url); 
    // Cache issue's comments
    var commentsCondition = /api\/[0-9]+\/comments\/?$/.test(e.request.url);
    // Cache github avatars
    var avatarsCondition = e.request.url.includes('avatars.githubusercontent.com');
    // Cache github statics
    var staticsCondition = e.request.url.includes('cloud.githubusercontent.com/assets');

    if (commentsCondition || avatarsCondition || staticsCondition) {
        e.waitUntil(
            fetch(e.request).then(function(response) {
                caches.open(cacheName).then(function(cache) {
                    console.log(e.request.url + ' was cached');
                    return cache.put(e.request, response);
                });
            })
            // caches.open(cacheName).then(function(cache) {
            //     return cache.add(e.request.url).then(function() {
            //         console.log(e.request.url + ' was cached');
            //     });
            // })  
        );
    }

    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});
