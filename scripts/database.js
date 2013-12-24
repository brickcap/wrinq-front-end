var openRequest = indexedDB.open("wrinq", 1);
var database;
openRequest.onupgradeneeded = function(e){
    database = e.target.result;
    addObjectStore(database,"profile",false);
    addObjectStore(database,"messages",false);
    addObjectStore(database,"application",true);
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

function addToAppStore(item,key){
    var storeApp = getStore("application","readwrite");
    
    if(key){    
	storeApp.add(item,key);
    }

    if(!key){

	storeApp.add(item);
    }

};

function addObjectStore(database,name,key){
    if(database.objectStoreNames.contains(name))return;

    if(key){

	database.createObjectStore(name,key);
    }

    if(!key){
	database.createObjectStore(name,{autoIncrement:true});
    }
};
