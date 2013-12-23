var openRequest = indexedDb.open("wrinq", 1);
var database;
openRequest.onupgradeneeded = function(e){
    database = e.target.result;
    addObjectStore("profile");
    addObjectStore("messages");
    addObjectStore("application");
};

openRequest.onsuccess = function(e){
    database = e.target.result;
};

openRequest.onerror = function(e){
console.log(e);
};

function addObjectStore(database,name){
    if(database.objectstoreNames.contains(name))return;
    database.createObjectStore(name);
};
