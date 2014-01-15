var helpers = {

    id : function(id){
	return document.getElementById(id);
    },
    show : function(e){
	e.style.display="block";
    },

    hide : function(e){
	e.style.display = "none";
	//use apply with this
    },
    hideM : function(e){
	var length = e.length;
	var i = 0;
	for(i;i<length;i++){
	    e[i].style.display = "none";
	}
    },
    clearHtml :function(e){
	e.innerHTML = '';
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
	
	var newline = /(\n|\r)/g;
	var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?*=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	
	var output=  input.replace(newline,"<br/>").replace(urlRegex,function(url){
	    if (( url.indexOf(".jpg") > 0 )||(url.indexOf(".jpeg") > 0 ) || (url.indexOf(".png") > 0) || (url.indexOf(".gif") > 0)) return '<br/><img src="' + url + '"><br/>';
	    else 
	    {
		return '<a href="' + url + '">' + url + '</a>';
	    }
	    

	});
	return output;
    },

    saveMessage : function(message,to){
	if(to)message.f = to;
	var request = addToStore(message,null,'messages');
	return;
    },
    addProfile: function(message){
	if(message.hasOwnProperty("m")){
	    if(!message.m.p){
		message.m.p = {};
		message.m.p.u = message.f;
		return message;
	    }
	    return message;
	}
	return message;
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
var sendBtn = helpers.id("sendBtn");
var btnReply = helpers.id("btnReply");
var messageDiv = helpers.id("messageDiv");
var conversation = helpers.id("conversation");
var tagDiv = helpers.id("tag");
var openRequest = indexedDB.open("wrinq", 1);
var prf;
var database;
var socket;



openRequest.onupgradeneeded = function(e){
    database = e.target.result;
    createObjectStore(database,"profile",false).createIndex("name","u",{unique:true});
    var ms= createObjectStore(database,"messages",false);
    ms.createIndex("tag","m.t",{unique:false});
    ms.createIndex("between",'f');
    ms.createIndex("profile","m.p.u",{unique:false});
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
	storeObject.put(item,key);
    }

    if(!key){

	storeObject.put(item);
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
	var profile = profileStore.get("master"); 
	profile.onsuccess = function(e){
	    if(!e.target.result){
		messageDiv.innerHTML = '<a href="/editprofile.html">create a profile</a>';
		return;
	    }
	    prf = e.target.result;
	};
	var messageStore = getStore('messages','readonly');
	var count = 0;
	var mStr ='';	
	messageStore.openCursor(null,'prev').onsuccess = function(e){
	    var cursor = e.target.result;
	   
	    if(count===10||!cursor){
		if(!count){
		   return;
		}
		if(count){
		    messages.innerHTML = mStr; 
		    return;
		}
	    }
	    
	    if(cursor){
		mStr = mStr+domElements.incomingMessage(cursor.value);
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
	socket.send(JSON.stringify({"ret":1}));
	helpers.show(app);
    };
    socket.onmessage = function(e){
	var message = JSON.parse(e.data);
	if(message.hasOwnProperty("msgs") && message.msgs.length>0){
	    
	    var messageArray = message.msgs;	    
	    var length = messageArray.length;
	    var i =0;
	    var mStr = '';
	    for(i;i<length;i++){
		
		var parsed = JSON.parse(messageArray[i]);
		var m = helpers.addProfile(parsed);
		helpers.saveMessage(m);
		console.log(m);
		messages.innerHTMl = domElements.incomingMessage(m) + messages.innerHTMl;
	    }
	   
	    socket.send(JSON.stringify({"delmsg":1}));
	    return;
	}
	if(message.hasOwnProperty("m")){
	    helpers.addProfile(message);	
	    helpers.saveMessage(message);
	    messages.innerHTML = domElements.incomingMessage(message)+ messages.innerHTML;
	    return;	
	}	
    };
    socket.onerror = function(e){

	messageDiv.innerHTML +='<p id="error-message">Could not connect to the server.Try refreshing.</p>';
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

    'signUpForm' :'<form  id ="signUpForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder= "username" onblur="checkUser(this)" onfocus = "clearMessages()" required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton"  value="sign up" disabled/></p></form><p id ="message"></p><p><span class ="underline-spans" onclick = "loginClick()">or login<span></p>',

    'loginForm': '<form  method="POST" id="loginForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder="username"  required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton" name="" value="login"/></p></form><p id= "message"></p><p ><span class ="underline-spans" onclick ="signUpClick()">or sign-up<span></p>',

    'commentBox':'<div class="box"><p><textarea rows="5" name="message" placeholder="your message" onkeyup="autoGrow(this)"></textarea></p></div> <span><button type="button" onclick="reply(this)" id="btnReply disabled">post</button></span><span><button type="button" onclick="removeCommentBox(this)">cancel</button>',

    'contact' : function(o){
	var temp = '<div class="contacts"><h1 style="text-align:center;">contacts</h1></div>';
	return temp;
    },
    'sendMessage' : '<div  class="box"><p><input type="text" name="to" placeholder="to" onblur="check(this)"/></p><p><textarea rows="5" placeholder="your message" onkeyup="autoGrow(this)" name="message"></textarea></p><p><input type="text" name="tag" placeholder="tag"/></p></div> <span><button type="button" onclick="send(this)" id="btnSend" disabled>post</button></span>',

    'incomingMessage' : function(m){
	var mDate = m.day+'-'+m.month+'-'+m.year+" ";
	var min = m.min>10?m.min:'0'+m.min;
	var mTime = (m.hour>=12)?m.hour-12+':'+min+'PM':m.hour+':'+min+' AM';
	var to = m.hasOwnProperty("to")?'to: <span class="details" onclick="showConversation(this)">'+m.to+'</span>':'';
	var det =function(){
	    var name = m.hasOwnProperty("to")?'':m.f+':';
	    if(!m.m.p) return "[<span onclick='showConversation(this)' class='details'><em>"+name+"</em></span> ";
	    if(!m.m.p.hasOwnProperty("pic")) return "[<span onclick='showConversation(this)' class='details'><em>"+name+"</em></span> ";
	    if(m.m.p.hasOwnProperty("pic")) return "<img  class='img-span' src="+m.m.p.pic+"</img>[<span class='details' onclick='showConversation(this)'>"+name+"</span>";
	    return '';
	};
	var msg = helpers.output(m.m.m);
	var tag = m.m.t?m.m.t:'';
	if(tag) save(tag,"tags");
	var ms = '<div class="messageBody" data-to="'+m.f+'" data-tag="'+tag+'"><hr style="border-color:#fff"/><p><span>'+det()+'</span><span> <em>'+mDate+mTime+'</em>]</span></p><span>'+msg+'</span><p><span class="details" onclick="showTag(this)">'+tag +'</span>'+to+'</p> <p><button onclick = "addCommentBox(this)">reply</button></p> </div></div>';
	return ms;
    }

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

var submitAjax = function(e,f){
    e.preventDefault();   
    var fData = helpers.serializeTextFields(f);   
    helpers.ajax(helpers.buildAjaxPostObject(f,fData));
};

var checkUser = function(e){
    var submitButton = helpers.id("submitButton");
    var message = helpers.id("message");
    submitButton.disabled = true;
    if(!e.value) return;
    var ajaxObject = {
	url: '/checkuser?name="'+e.value+'"',
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
function check(e){
    btnSend.disabed = true;
        if(!e.value) return;
    var ajaxObject = {
	url: '/checkuser?name="'+e.value+'"',
	method: 'GET',
	successCallback:function(response){
	    
	    if(JSON.parse(response).available){
		
		return;
	    } 
	    else{
		btnSend.disabled = false;
	    }
	}
    };

    helpers.ajax(ajaxObject);
}
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
    e.parentNode.parentNode.innerHTML = '<button  onclick = "addCommentBox(this)">reply</button>';
};


function send(e){
    var to = document.getElementsByName("to")[0].value;
    var tags = document.getElementsByName("tag")[0].value;
    var temp = document.createElement("div");
    temp.innerHTML = document.getElementsByName("message")[0].value;
    var message = temp.innerText||temp.textContent;
    if(!to||!message){
	e.parentNode.parentNode.innerHTML += '<p>The message can not be empty</p>';   
 }
    var messagePacket = {"to":to, "m":{'t':tags,m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    helpers.saveMessage(buildDate(messagePacket),to);
    save(to,"sent");
    if(tags)save(tags,"tags");
    return;
};


function reply(e){
var parent = e.parentNode.parentNode.parentNode.parentNode;
var to = parent.getAttribute("data-to");
var tags = parent.getAttribute("data-tags");
var sendError = helpers.id("sendError");
 if(sendError)helpers.hide(sendError);
    var message = document.getElementsByName("message")[0].value;
    if(!message){
	e.parentNode.parentNode.innerHTML += '<p>The message can not be empty</p>';
	return;
    }
    var messagePacket = {"to":to, "m":{'t':tags,m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    helpers.saveMessage(buildDate(messagePacket),to);
    save(to,"sent");
    if(tags)save(tags,"tags");
};

function buildProfile(to,messagePacket){
    
    if(!prf){ 

	messagePacket.m.p = null;
	return messagePacket;
    }
    var p = {"n":prf.name,"pic":prf.pic,"a":prf.about};
    messagePacket.m.p = p;
    return messagePacket;
    
    return messagePacket;
};

function save(item,key){
    var exists = localStorage.getItem(key);
    if(!exists){
	exists = JSON.stringify([item]);
	console.log(exists);
	localStorage.setItem(key,exists);
	return;
    }
    if(exists){
	var parsed = JSON.parse(exists);
	if(!parsed.indexOf(item)){
	    parsed.push(item);
	    localStorage.setItem(key,JSON.stringify(exists));
	}
	return;
    }   
}

function buildDate(messagePacket){
    var date = new Date();
    messagePacket.month = date.getMonth()+1;
    messagePacket.day = date.getDay();
    messagePacket.year = date.getFullYear();
    messagePacket.min = date.getMinutes();
    messagePacket.hour = date.getHours();
    messagePacket.sec = date.getSeconds();
    return messagePacket;
}

function showConversation(e){
    var to = e.parentNode.parentNode.parentNode.getAttribute("data-to")||e.parentNode.parentNode.getAttribute("data-to");
    helpers.hideM([sendMessage,messages,tagDiv]);
    helpers.show(conversation);   
    buildMessages(to);
};


function buildMessages(to){
    var mStore = getStore('messages','readonly');
    var mIndex = mStore.index("between");
    var keyRange = IDBKeyRange.only(to);
    var cursor = mIndex.openCursor(keyRange,'prev');
    var count = 0;
    var mStr='';
    //use cursor.advance(int);
    cursor.onsuccess = function(e){
	var item = e.target.result;
	if(item && count!=10){
	    item.continue();
	    mStr = mStr + domElements.incomingMessage(item.value);
	    count++;
	}
	if(!item||count===10){
	    var heading = '<h1 class="center-div">Your conversation with '+to+'</h1>';
	    conversation.innerHTML = heading+mStr;
	    conversation.scrollIntoView();
	}
    };
}

function showTag(e){
    var tag = e.parentNode.parentNode.getAttribute("data-tag");
    helpers.hideM([sendMessage,messages,conversation]);
    helpers.show(tagDiv);
    buildTag(tag);
}

function buildTag(t){
    console.log(t);
    var mStore = getStore('messages','readonly');
    var mIndex = mStore.index("tag");
    var keyRange = IDBKeyRange.only(t);
    var cursor = mIndex.openCursor(keyRange,'prev');
    var count = 0;
    var mStr='';
    //use cursor.advance(int);
    cursor.onsuccess = function(e){
	var item = e.target.result;
	if(item && count!=10){
	    item.continue();
	    count++;
	    mStr = mStr + domElements.incomingMessage(item.value);
	}
	if(!item||count===10){
	    var heading = '<h1 class="center-div">Messages Tagged as '+t+'</h1>';
	    tagDiv.innerHTML = heading+mStr;   
	    tagDiv.scrollIntoView();

	}
    };
}


function messageBox(){
helpers.hideM([messages,conversation,tagDiv]);
sendMessage.innerHTML = domElements.sendMessage;
helpers.show(sendMessage);
};


function  showActivity(){
helpers.hideM([sendMessage,conversation,tagDiv]);
helpers.show(messages);
messages.scrollIntoView();

};
