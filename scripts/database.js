var openRequest = indexedDB.open("wrinq", 1);
var database;
openRequest.onupgradeneeded = function(e){
    database = e.target.result;
     addObjectStore(database,"profile");
     addObjectStore(database,"messages");
     addObjectStore(database,"application");
};

openRequest.onsuccess = function(e){
    database = e.target.result;
};

openRequest.onerror = function(e){
console.log(e);
};

function addObjectStore(database,name){
    if(database.objectStoreNames.contains(name))return;
    database.createObjectStore(name);
};
