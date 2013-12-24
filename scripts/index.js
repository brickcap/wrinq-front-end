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

	database.createObjectStore(name);
    }

    if(!key){
	database.createObjectStore(name,{autoIncrement:true});
    }
};

var checkSession = function(){
    var storeApp = getStore('application','readonly');
    var result =  storeApp.get("sess");
    
    result.onsuccess = function(e){
	
	if(!e.target.result) {
	    helpers.show(splashDiv);
	    return;
	}
	helpers.hide(splashDiv);
	socketManager(e.target.result.session);
    };
    
};

var socketManager  = function(sess){

    var socket = new WebSocket('ws://localhost:3000/websocket/'+sess);
    socket.onopen = function(data){
	console.log(data);
    };
    socket.onmessage = function(e){
    };
    socket.onerror = function(e){
	console.log(e);
	helpers.show(splashDiv);
    };
    return socket;
};

var logincallback = {
    successCallback: function(responseText){
	helpers.hide(formDiv);
	addToAppStore({"session":responseText},"sess");
	checkSession();
    },
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "Login failed.";
    }
};

var createcallback = {
    successCallback: function(responseText){
	helpers.hide(formDiv);
    },
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "This action could not be completed";
    }
};

var helpers = {

    id : function(id){
	return document.getElementById(id);
    },
    show : function(element){
	element.style.display="block";
    },

    hide : function(element){
	element.style.display = "none";
    },
    clearHtml :function(element){
	element.innerHTML = '';
    },

    serializeTextFields : function(form){
	
	var i=0;
	var length= form.elements.length -1;
	var data = "";
	for(i;i<length;i++){
	    var name = form.elements[i].name;
	    var value = form.elements[i].value;
	    var pair = name+'='+value+'&';
	    data = data+encodeURI(pair); 
	}
	return data;	
    },
    buildAjaxPostObject :function(form,formData){
	var ajaxObject = {
	    data : formData,
	    method:"POST"
	};
	if(form.id==='loginForm'){
	    ajaxObject.url = '/login';
	    ajaxObject.successCallback = logincallback.successCallback;
	    ajaxObject.errorCallback = logincallback.errorCallback;
	}
	if(form.id==='signUpForm'){
	    ajaxObject.url = '/createuser';
	    ajaxObject.successCallback = createcallback.successCallback;
	    ajaxObject.errorCallback = createcallback.errorCallback;
	    
	}
	return ajaxObject;
    },
    ajax: function(options){
	var request = new XMLHttpRequest();
	request.open(options.method,options.url,true);
	request.onreadystatechange = function(){
	    if(request.status===404)options.errorCallback();
	    if(request.status!=200||request.readyState!=4)return;
	    options.successCallback(request.responseText);
	};
	     request.send(options.data);
   }

};


var domElements = {

    'signUpForm' :'<form  id ="signUpForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder= "username" onfocusout="checkUser(this)" onfocus = "clearMessages()" required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton"  value="sign up" disabled/></p></form><p id ="message"></p><p><span class ="underline-spans" onclick = "loginClick()">or login<span></p>',

    'loginForm': '<form  method="POST" id="loginForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder="username"  required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton" name="" value="login"/></p></form><p id= "message"></p><p ><span class ="underline-spans" onclick ="signUpClick()">or sign-up<span></p>'

};





var signUp= helpers.id("signup");
var login= helpers.id("login");
var splashDiv = helpers.id("splash");
var formDiv = helpers.id("formDiv");

var signUpClick = function(){
helpers.hide(splashDiv);
formDiv.innerHTML = domElements.signUpForm;
};

var loginClick = function(){
helpers.hide(splashDiv);
formDiv.innerHTML= domElements.loginForm;
};

var submitAjax = function(event,form){
    event.preventDefault();   
    var formData = helpers.serializeTextFields(form);
   
    helpers.ajax(helpers.buildAjaxPostObject(form,formData));

};

var checkUser = function(input){
    var submitButton = helpers.id("submitButton");
    var message = helpers.id("message");
    submitButton.disabled = true;
    if(!input.value) return;
    var ajaxObject = {
	url: '/checkuser?name="'+input.value+'"',
	method: 'GET',
	successCallback:function(response){
	    
	    if(JSON.parse(response).available){
		submitButton.disabled = false;
		return;
	    } 
	    else{
		submitButton.disabled = true;
		message.innerHTML = "The username is taken";
	    }
	}
    };

    helpers.ajax(ajaxObject);
};

var clearMessages = function(){
    var message = helpers.id("message");
    message.innerHTML = '';
   
};
