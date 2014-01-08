
openRequest.onupgradeneeded = function(e){
    database = e.target.result;
    createObjectStore(database,"profile",false).createIndex("name","n",{unique:true});
    var profile= createObjectStore(database,"messages",false);
    profile.createIndex("tag","t",{unique:false});
    profile.createIndex("between",'m.w');
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
    var tran = database.transaction([objectStore],permission);
    var store = tran.objectStore(objectStore);    
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
    return storeObject;
};

function createObjectStore(database,name,key){
    if(database.objectStoreNames.contains(name))return null;

    if(key){

	return database.createObjectStore(name);
    }

    if(!key){
	return	database.createObjectStore(name,{autoIncrement:true});
    }
    return null;
};
