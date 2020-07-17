const db = new PouchDB('postdb');


// Changes in the database.
const databaseOnChange = function () {
    
}

// Add post.
const addPost = function (text) {
    var post = {
        _id: new Date().toISOString(), 
        message: text, 
        completed: false
    };

    return db.put(post).then(status => {

        self.ServiceWorkerRegistration.sync.register('Task_NewPost');

        const response = { ok: true, offline: true }

        return new Response(JSON.stringify(response));

    }).catch(ex => {
        console.error(ex);
    });   
}

// Remove post.
const removePost = function (post) {
    db.remove(post);
}

// Read pending post.
const readPendingPosts = function () {
    db.allDocs({include_docs: true, descending: false}).then(items => {
        console.log(items);
    });
}

// Listen to changes in the database.
db.changes({ since: 'now', live: true }).on('change', databaseOnChange);