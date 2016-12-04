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
        );
    }

    if (avatarsCondition) {
        e.respondWith(
            getFromCache(e.request).catch(function() {
                console.log('Fetching from the network ' + e.request.url);
                return getFromNetwork(e.request);
            })
        );
    } else {
        e.respondWith(
            getFromNetwork(e.request).catch(function() {
                console.log('trying to get from cache' + e.request.url);
                return getFromCache(e.request).catch(console.error);
            })
        );
    }
});

function getFromNetwork(request, timeout) {
    timeout || (timeout = 1000);

    return new Promise(function(resolve, reject) {
        var timeoutFn = setTimeout(function() { console.log('rejected'); reject(); }, timeout);

        fetch(request).then(function(response) {
            clearTimeout(timeoutFn);
            resolve(response);
        }, reject);
    });
}


function getFromCache(request) {
    return caches.open(cacheName)
        .then(function(cache) {
            return cache.match(request)
                .then(function(response) {
                    return response || Promise.reject('nothing found');
                });
        });
}
