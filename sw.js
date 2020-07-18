importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js');
importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');

const CACHE_INMUTABLE_NAME = 'inmutable-v1';
const CACHE_STATIC_NAME    = 'static-v1';
const CACHE_DYNAMIC_NAME   = 'dynamic-v1';

const CACHE_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://fonts.gstatic.com/s/quicksand/v21/6xKtdSZaM9iE8KbpRA_hK1QNYuDyPw.woff2',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://use.fontawesome.com/releases/v5.3.1/webfonts/fa-solid-900.woff2',
    'https://use.fontawesome.com/releases/v5.3.1/webfonts/fa-brands-400.woff',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js',
    'css/animate.css',
    'js/libs/jquery.js'
];
const CACHE_STATIC = [
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'manifest.json',
    'js/sw-utils.js',
    'js/sw-db.js',
    'js/app.js'
];

// Start listening function in event 'install'. Save assets and cache.
self.addEventListener('install', event => { 
    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache => {
        return cache.addAll(CACHE_INMUTABLE).then(() => {
            console.log('Store ' + CACHE_INMUTABLE_NAME);
        });
    });

    const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache => {
        return cache.addAll(CACHE_STATIC).then(() => {
            console.log('Store ' + CACHE_STATIC_NAME);
        });
    });

    event.waitUntil( Promise.all([cacheStatic, cacheInmutable]) );
})

// Start listening function in event 'activate'. Remove old service workers.
self.addEventListener('activate', event => {
    const cacheStatic = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key.includes('static-v') && key !== CACHE_STATIC_NAME) {
                return caches.delete(key);
            }

            if (key.includes('dynamic-v') && key !== CACHE_DYNAMIC_NAME) {
                return caches.delete(key);
            }
        });
    });

    event.waitUntil( cacheStatic );
})

// Start listening function in event 'fetch'.
self.addEventListener('fetch', event => {  
    let responseCache;

    if (event.request.url.includes('/api')) {        
        // Strategy Network first and cache fallback update.
        responseCache = NetworkFirstCacheFallback(event.request, CACHE_DYNAMIC_NAME);
    } else {     
        // Strategy Cache first and update from the network.
        responseCache = CacheFirstUpdateNetwork(event.request, CACHE_STATIC_NAME);
    }

    event.respondWith( responseCache );
})

// Start listening function in event 'sync'. Reestablish online connection.
self.addEventListener('sync', event => {
    if (event.tag === 'Task_NewPost') {       
        const request = readPendingPosts();

        event.waitUntil(request);
    }
})

// Start listening function in event 'push'. Receive notification.
self.addEventListener('push', event => {
    console.log("Receive notification, event 'push'.");
})