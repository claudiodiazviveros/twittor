// function strategy Cache first and Update from the network.
const CacheFirstUpdateNetwork = function (request, cacheName) {

    return caches.match(request).then(itemCache => { 
        
        if (itemCache) {          
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