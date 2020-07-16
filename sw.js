importScripts('js/sw-utils.js');

const CACHE_INMUTABLE_NAME = 'inmutable-v1';
const CACHE_STATIC_NAME    = 'static-v2';
const CACHE_DYNAMIC_NAME   = 'dynamic-v1';

const CACHE_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://fonts.gstatic.com/s/quicksand/v21/6xKtdSZaM9iE8KbpRA_hK1QNYuDyPw.woff2',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://use.fontawesome.com/releases/v5.3.1/webfonts/fa-solid-900.woff2',
    'https://use.fontawesome.com/releases/v5.3.1/webfonts/fa-brands-400.woff',
    'css/animate.css',
    'js/libs/jquery.js'
];
const CACHE_STATIC = [
    '/',
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
    
    // Strategy Cache first and Update from the network.
    let responseCache = CacheFirstUpdateNetwork(event.request, CACHE_STATIC_NAME);

    event.respondWith( responseCache );
})