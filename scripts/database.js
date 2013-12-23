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
    checkSession();
};

openRequest.onerror = function(e){
    console.log(e);
};

function getStore(objectStore,permission){
    var tranApp = database.transaction([objectStore],permission);
    var storeApp = tranApp.objectStore(objectStore);    
    return storeApp;
};

function addToAppStore(item){
    var storeApp = getStore("application","readwrite");
    storeApp.add(item);
};

function addObjectStore(database,name){
    if(database.objectStoreNames.contains(name))return;
    database.createObjectStore(name,{autoIncrement:true});
};
