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

    db.put(post).then(status => {
        console.log('Successfully posted: ', status);
    }).catch(ex => {
        console.log(ex);
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