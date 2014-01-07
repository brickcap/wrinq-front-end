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

    saveMessage : function(message){

	var request = addToStore(message,null,'messages');
	request.onsuccess = function(){
	    console.log("added message successfuly");
	};
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
var id = helpers.id("conversation");
var openRequest = indexedDB.open("wrinq", 1);
var prf;
var database;
var socket;



openRequest.onupgradeneeded = function(e){
    database = e.target.result;
    createObjectStore(database,"profile",false).createIndex("name","n",{unique:true});
    var profile= createObjectStore(database,"messages",false);
    profile.createIndex("tag","t",{unique:false});
    profile.createIndex("between",['to','f']);
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
	var	profile = profileStore.get("master"); 
	profile.onsuccess = function(e){
	    if(!e.target.result){
		messageDiv.innerHTML = '<a href="/editprofile.html">create a profile</a>';
		return;
	    }
	    prf = e.target.result;
	};
	var messageStore = getStore('messages','readonly');
	var count = 0;	
	messageStore.openCursor(null,'prev').onsuccess = function(e){
	    var cursor = e.target.result;
	    if(count===10||!cursor){
		if(!count){
		    var appMessage = helpers.id("appMessage");
		    appMessage.innerHTML = '<p>No recent activity</p>';
		    helpers.show(appMessage);
		}
		return;
	    }
	    
	    if(cursor){
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
	if(!message.hasOwnProperty("m"))return;
	helpers.saveMessage(message);
	var hasP = message.m.hasOwnProperty("p"); 
	if(hasP){
	    console.log(message);
	    messages.innerHTML = domElements.incomingMessage(message)+ messages.innerHTML;
	    addToStore(message.m.p,null,'profile'); 
	}
	if(!hasP){
	    var pStore = getStore("profile",'readonly');
	    var pIndex = pStore.index("name");
	    var request = pIndex.get(message.f);
	     request.onsuccess = function(e){
		var result = e.target.result;
		message.m.p = result;
		 messages.innerHTML = domElements.incomingMessage(message)+messages.innerHTML;
	    };
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

    'commentBox':'<div class="box"><p><textarea rows="5" name="message" placeholder="your message" onkeyup="autoGrow(this)"></textarea></p></div> <span><button type="button" onclick="reply(this)">post</button></span><span><button type="button" onclick="removeCommentBox(this)">cancel</button>',

    'contact' : function(o){
	var temp = '<div class="contacts"><h1 style="text-align:center;">contacts</h1></div>';
	return temp;
    },
    'addContact' : '<div class="center-div"><input type="text" placeholder="username of the contact"/><p><button>send request</button></p></div>',

    'sendMessage' : '<div  class="box"><p><input type="text" name="to" placeholder="@to"/></p><p><textarea rows="5" placeholder="your message" onkeyup="autoGrow(this)" name="message"></textarea></p><p><input type="text" name="tag" placeholder="#tag  (optional)"/></p></div> <span><button type="button" onclick="send(this)">post</button></span>',

    'incomingMessage' : function(m){
	console.log(m);
	var mDate = m.day+'-'+m.month+'-'+m.year+" ";
	var mTime = (m.hour>=12)?m.hour-12+':'+m.min+' PM':m.hour+':'+m.min+' AM';
	var det =function(){
	    if(!m.m.p) return "[<span onclick='showConversation(this)' class='details'><em>"+m.f+":</em></span> ";
	    var name = m.m.p.hasOwnProperty('n')?m.m.p.n:m.f;
	    if(!m.m.p.hasOwnProperty("pic")) return "[<span onclick='showConversation(this)' class='details'><em>"+name+":</em></span> ";
	    if(m.m.p.hasOwnProperty("pic")) return "<img  class='img-span' src="+m.m.p.pic+"</img>[<span class='details' onclick='showConversation(this)'>"+name+"</span>";
	    return '';
	};
	var msg = helpers.output(m.m.m);
	var tag = m.m.t?m.m.t:'';
	var ms = '<div class="messageBody" data-to="'+m.f+'" data-tag="'+tag+'"><hr style="border-color:#fff"/><p><span>'+det()+'</span><span> <em>'+mDate+mTime+'</em>]</span></p><span>'+msg+'</span> <div> <p><button onclick = "addCommentBox(this)">reply</button></p> </div></div>';
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
    e.parentNode.parentNode.innerHTML = '<button  onclick = "addCommentBox(this)">reply</button>';
};


function send(e){
    var sendError = helpers.id("sendError");
    if(sendError)helpers.hide(sendError);
    var to = document.getElementsByName("to")[0].value;
    var tags = document.getElementsByName("tag")[0].value;
    var temp = document.createElement("div");
    temp.innerHTML = document.getElementsByName("message")[0].value;
    var message = temp.innerText||temp.textContent;
    if(!to||!message){
	e.parentNode.parentNode.innerHTML += '<p id="sendError">There must be a valid username and a non empty message</p>';   
 }
    var messagePacket = {"to":to, "msg":{'t':tags,m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    helpers.saveMessage(messagePacket);
    saveContact(to);
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
	e.parentNode.parentNode.innerHTML += '<p id="sendError">The message can not be empty</p>';
	return;
    }
    var messagePacket = {"to":to, "msg":{'t':tags,m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    helpers.saveMessage(messagePacket);
    saveContact(to);
};

function buildProfile(to,messagePacket){
    var result = localStorage.getItem("sent");
    
    if(!result){
	if(!prf) return messagePacket;
	var p = {"n":prf.name,"pic":prf.pic,"a":prf.about};
	messagePacket.msg.p = p;
	return messagePacket;
    }
    return messagePacket;
};

function saveContact(contactInfo){
    var sent = localStorage.getItem("sent");
    if(!sent){
	sent = JSON.stringify([contactInfo]);
	console.log(sent);
	localStorage.setItem("sent",sent);
	return;
    }
    if(sent){
	var parsed = JSON.parse(sent);
	if(!parsed.indexOf(contactInfo)){
	    parsed.push(contactInfo);
	    localStorage.setItem("sent",JSON.stringify(sent));
	}
	return;
    }
    
}

function showConversation(e){
    var to = e.parentNode.parentNode.parentNode.getAttribute("data-to");
    helpers.hide(sendMessage);
    helpers.hide(messages);
    helpers.show(conversation);
    console.log(to);
    buildMessages(to);
};


function buildMessages(to){
    var messageStore = getStore('messages','readonly');
    var messageIndex = messageStore.index("between");
    var keyRange = IDBKeyRange.bound([null,to],[to,null]);
    var cursor = messageIndex.openCursor(keyRange,'prev');
    var count = 0;
    var mStr;
    //Create another index for pagination that accepts the last item name as the index
    cursor.onsuccess = function(e){
	var item = e.target.result;
	console.log(item);
	if(item){
	    item.continue();
	    mStr = mStr + helpers.incomingMessage(item);
	    count++;
	}
	if(!item||count===10){
	   conversation.innerHTML = mStr;   
	}
    };
}

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
