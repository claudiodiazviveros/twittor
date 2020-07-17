// function strategy Cache first and Update from the network.
const CacheFirstUpdateNetwork = function (request, cacheName) {

    return caches.match(request).then(itemCache => { 
        
        if (itemCache) {     
            
            fetch(request).then(response => {
                if (response.ok) {

                    caches.open(cacheName).then( cache => {
                        cache.put(request, response.clone());
                    });

                }
            });            
            return itemCache;

        } else {

            return fetch(request).then(response => {
                if (response.ok) {

                    caches.open(cacheName).then( cache => {
                        cache.put(request, response.clone());
                    });
                    return response.clone();

                } else {
                    return response.clone();
                }
            });
        }

    });
}

// function strategy Network first and cache fallback update.
const NetworkFirstCacheFallback = function (request, cacheName) {

    return fetch(request).then(response => {
        if (response.ok) {

            caches.open(cacheName).then( cache => {
                cache.put(request, response.clone());
            });
            return response.clone();

        } else {
            return caches.match(request);
        }
    }).catch(ex => {
        return caches.match(request);
    });

}


const test = function () {
    fetch('api/posts.json').then(response => {
        console.log(response);
    });
}

