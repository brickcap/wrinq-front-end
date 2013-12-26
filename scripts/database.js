var openRequest = indexedDB.open("wrinq", 1);
var database;
openRequest.onupgradeneeded = function(e){
    database = e.target.result;
    createObjectStore(database,"profile",false);
    createObjectStore(database,"messages",false);
    createObjectStore(database,"application",true);
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
    var store = tranApp.objectStore(objectStore);    
    return store;
};

function addToStore(item,key,store){
    var storeObject = getStore(store,"readwrite");
    
    if(key){    
	storeObject.add(item,key);
    }

    if(!key){

	storeObject.add(item);
    }

};

function createObjectStore(database,name,key){
    if(database.objectStoreNames.contains(name))return;

    if(key){

	database.createObjectStore(name);
    }

    if(!key){
	database.createObjectStore(name,{autoIncrement:true});
    }
};
