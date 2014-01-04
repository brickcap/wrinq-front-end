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
	    ajaxObject.successCallback =logincallback.successCallback;
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
    },

    successCallback : function(responseText){
	var storeObject = addToStore({"session":responseText},"sess","application");
	storeObject.transaction.oncomplete = function(){
	    checkSession();
	};
    },
    output: function(input){
	var userRegex = /\B(@[^ ]+)\s/g;
	var hashRegex = /\B(#[^ ]+)\s/g;
	var newline = /(\n|\r)/g;
	var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	
	var output=  input.replace(userRegex,'<span class="underline-spans">$1</span>').replace(hashRegex,'<span class="underline-spans">$1</span>').replace(newline,"<br/>").replace(urlRegex,function(url){
	    if (( url.indexOf(".jpg") > 0 )||(url.indexOf(".jpeg") > 0 ) || (url.indexOf(".png") > 0) || (url.indexOf(".gif") > 0)) return '<img src="' + url + '">' + '<br/>';
	    else 
	    {
		return '<a href="' + url + '">' + url + '</a>' + '<br/>';
	    }
	    

	});
	console.log(output);
	return output;
    },

    saveMessage : function(message){
	var request = addToStore(message,null,'messages');
	request.onsuccess = function(){
	    console.log("added message successfuly");
	};
    },
    saveContact:function(contactInfo){
    }
};


var signUp= helpers.id("signup");
var login= helpers.id("login");
var splashDiv = helpers.id("splash");
var formDiv = helpers.id("formDiv");
var app = helpers.id("app");
var appBody = helpers.id("appBody");
var appMessage = helpers.id("appMessage");
var messages = helpers.id("messages");
var sendMessage = helpers.id("sendMessage");
var messageDiv = helpers.id("messageDiv");
var openRequest = indexedDB.open("wrinq", 1);
var database;
var socket;
var profile;


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
    if(database.objectStoreNames.contains(name))return;

    if(key){

	database.createObjectStore(name);
    }

    if(!key){
	database.createObjectStore(name,{autoIncrement:true});
    }
};

var checkSession = function(){
    var appStore = getStore('application','readonly');
    var result =  appStore.get("sess");     
    result.onsuccess = function(e){

	if(!e.target.result) {
	    helpers.show(splashDiv);
	    return;
	}
	helpers.hide(splashDiv);
	helpers.hide(formDiv);
	var profileStore = getStore("profile",'readonly');
	profile = profileStore.get("master"); 
	profile.onsuccess = function(e){
	    if(!e.target.result){
		messageDiv.innerHTML = '<a href="/editprofile.html">create a profile</a>';
		return;
	    }
	};
	var messageStore = getStore('messages','readonly');
	var count = 0;	
	messageStore.openCursor(null,'prev').onsuccess = function(event){
	    var cursor = event.target.result;
	    if(count===10){		
		return;
	    }
	    
	    if(cursor){
		console.log(count);
		cursor.continue();
		count++;
	    }  
	    
	};
	socket=	socketManager(e.target.result.session);
    };
    
};

var socketManager  = function(sess){

    var socket = new WebSocket('ws://localhost:3000/websocket/'+sess);
    socket.onopen = function(data){
	helpers.show(app);
    };
    socket.onmessage = function(e){
	var message = JSON.parse(e.data);
	if(message.hasOwnProperty("m")){
	    var contactInfo = message.m.p; 
	    if(!contactInfo){
		helpers.saveMessage(message);
		return;
	   }
	  message.m.delete("p");
	 helpers. saveMessage(message);
	 helpers.saveContact(contactInfo);   
	}
    };
    socket.onerror = function(e){

	messageDiv.innerHTML +='<p id="error-message">Could not connect to the server.Try refreshing.</p>';
	console.log(app);	
	helpers.show(app);
    };
    return socket;
};

var logincallback = {
    successCallback: helpers.successCallback,
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "Login failed.";
    }
};

var createcallback = {
    successCallback: helpers.successCallback,
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "This action could not be completed";
    }
};

var domElements = {

    'signUpForm' :'<form  id ="signUpForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder= "username" onfocusout="checkUser(this)" onfocus = "clearMessages()" required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton"  value="sign up" disabled/></p></form><p id ="message"></p><p><span class ="underline-spans" onclick = "loginClick()">or login<span></p>',

    'loginForm': '<form  method="POST" id="loginForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder="username"  required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton" name="" value="login"/></p></form><p id= "message"></p><p ><span class ="underline-spans" onclick ="signUpClick()">or sign-up<span></p>',

    'commentBox':'<div class="box"><p><textarea rows="5" name="message" placeholder="your message" onkeyup="autoGrow(this)"></textarea></p></div> <span><button type="button" onclick="reply(this)">post</button></span><span><button type="button" onclick="removeCommentBox(this)">cancel</button>',

    'contact' : function(o){
	var temp = '<div class="contacts"><h1 style="text-align:center;">contacts</h1></div>';
	return temp;
    },
    'addContact' : '<div class="center-div"><input type="text" placeholder="username of the contact"/><p><button>send request</button></p></div>',

    'sendMessage' : '<div  class="box"><p><input type="text" name="to" placeholder="@to"/></p><p><textarea rows="5" placeholder="your message" onkeyup="autoGrow(this)" name="message"></textarea></p><p><input type="text" name="tag" placeholder="#tag  (optional)"/></p></div> <span><button type="button" onclick="send(this)">post</button></span>'

};






var signUpClick = function(){
helpers.hide(splashDiv);
formDiv.innerHTML = domElements.signUpForm;
helpers.show(formDiv);
};

var loginClick = function(){
helpers.hide(splashDiv);
formDiv.innerHTML= domElements.loginForm;
helpers.show(formDiv);
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


function autoGrow (oField) {
    if (oField.scrollHeight > oField.clientHeight) {
	oField.style.height = oField.scrollHeight + "px";
    }
   
};

function addCommentBox(e){
    e.parentNode.innerHTML = domElements.commentBox;
};

function removeCommentBox(e){
    e.parentNode.parentNode.innerHTML = '<span  class="action-item" title="reply" onclick = "addCommentBox(this)">&lt;\\&gt;</span>';
};


function send(e){
    var sendError = helpers.id("sendError");
    if(sendError)helpers.hide(sendError);
    var to = document.getElementsByName("to")[0].value;
    var tags = document.getElementsByName("tag")[0].value;
    var message = document.getElementsByName("message")[0].value;
    if(!to||!message){
	e.parentNode.parentNode.innerHTML += '<p id="sendError">There must be a valid username and a non empty message</p>';   
 }
    var messagePacket = {"to":to, "msg":{'t':tags,m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    helpers.saveMessage(messagePacket);
    return;
};


function reply(e){
var sendError = helpers.id("sendError");
 if(sendError)helpers.hide(sendError);
var message = document.getElementsByName("message")[0].value;
    if(!message){
	e.parentNode.parentNode.innerHTML += '<p id="sendError">The message can not be empty</p>';
	return;
    }

};

function buildProfile(to,messagePacket){
    var result = profile.result;
    
    if(result && result.sent.indexOf(to)===-1){
	
	var p = {"n":result.name,"pic":result.pic,"a":result.about};
	messagePacket.msg.p = p;
	console.log(messagePacket);
	return messagePacket;
    }
    return messagePacket;
};


function messageBox(){
helpers.hide(appMessage);
helpers.hide(messages);
sendMessage.innerHTML = domElements.sendMessage;
helpers.show(sendMessage);
};


function  showActivity(){
helpers.hide(sendMessage);
helpers.show(messages);
};
