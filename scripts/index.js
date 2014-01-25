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
	
	var parsed = JSON.parse(responseText);
	var key = Object.keys(parsed)[0];
	var storeObject = addToStore({"session":key},"sess","application");
	storeObject.transaction.oncomplete = function(){
	    localStorage.setItem("user",parsed[key]);
	    checkSession();
	};
    },
    output: function(input){
	
	var newline = /(\n{2}|\r{2})/g;
	var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?*=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	
	var output=  input.replace(newline,"<br>").replace(urlRegex,function(url){
	    if (( url.indexOf(".jpg") > 0 )||(url.indexOf(".jpeg") > 0 ) || (url.indexOf(".png") > 0) || (url.indexOf(".gif") > 0)) return '<br/><img src="' + url + '"><br/>';
	    return '<a href="' + url + '">' + url + '</a>';
	});
	return output;
    },

    saveMessage : function(message,to){
	if(to)message.f = to;
	var request = addToStore(message,null,'messages');
	return message;
    },
    addProfile: function(message){
	if(message.hasOwnProperty("m")){
	    if(!message.m.p){
		message.m.p = {};
		message.m.p.u = message.f;
		return message;
	    }
	    if(message.m.p && !message.m.p.u){
		message.m.p.u = message.f;
	    }
	    return message;
	}
	return message;
    },
    buildMessages: function(){
	var messageStore = getStore('messages','readonly');
	var count = 0;
	var mStr ='';	
	messageStore.openCursor(null,'prev').onsuccess = function(e){
	    var cursor = e.target.result;
	    if(count===20||!cursor){
		if(!count){
		    return;
		}
		if(count){
		    var needMore = count===20?'<p style="text-align:center" class="details" onclick="morePagesIndex('+cursor.key+',this)">more</p>':'';
		    messages.innerHTML = mStr+needMore;
		    showActivity();
		    return;
		}
	    }
	    
	    if(cursor){
		mStr = mStr+domElements.incomingMessage(cursor.value);
		cursor.continue();
		count++;
	    }  
	    
	};
    },
    humanDate : function(date){

	var seconds = Math.floor((new Date() - date) / 1000);

	var interval = Math.floor(seconds / 31536000);

	if (interval > 1) {
            return interval + "y";
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
            return interval + "m";
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
            return interval + "d";
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
            return interval + "h";
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
            return interval + " min";
	}
	return Math.floor(seconds) + "s";
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
var sIn = helpers.id("search");
var menu = helpers.id("menu");
var contactDiv = helpers.id("contact");
var openRequest = indexedDB.open("wrinq", 1);
var prf;
var database;
var socket;



openRequest.onupgradeneeded = function(e){
    database = e.target.result;
    createObjectStore(database,"profile",false);
    var ms= createObjectStore(database,"messages",false);
    ms.createIndex("between",'f');
    ms.createIndex("profile",'m.p.u');
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
	var user = localStorage.getItem("user");
	profile.onsuccess = function(e){
	    if(!e.target.result){
		messageDiv.innerHTML = '<a href="/editprofile.html">create a profile '+user+'</a>';
		return;
	    }
	    messageDiv.innerHTML = '<a href="/editprofile.html">'+user+'</a>';
	    prf = e.target.result;
	};
	helpers.buildMessages();
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
	   
	    for(i;i<length;i++){
		
		var parsed = JSON.parse(messageArray[i]);
		var m = helpers.addProfile(parsed);
		helpers.saveMessage(m);
	    }
	    var info = length>1?" messages were sent while you were offline":" message was sent while you were offline";
	    helpers.id("unread").innerHTML = length + info;
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

    'commentBox':'<div class="box"><p><textarea rows="5" name="reply" placeholder="your message" onkeyup="autoGrow(this)"></textarea></p></div> <span><button type="button" onclick="reply(this)" id="btnReply disabled">post</button></span><span><button type="button" onclick="removeCommentBox(this)">cancel</button>',

    'contact' : function(o){
	var temp = '<div class="contacts"><h1 style="text-align:center;">contacts</h1></div>';
	return temp;
    },
    'sendMessage' : '<div  class="box"><p><input type="text" name="to" placeholder="to" onblur="check(this)"/></p><p><textarea rows="5" placeholder="your message" onkeyup="autoGrow(this)" name="message"></textarea></p><p><input type="text" name="tag" placeholder="tag"/></p></div> <span><button type="button" onclick="send(this)" id="btnSend" disabled>post</button></span>',

    'incomingMessage' : function(m){
	// var mDate = m.day+'-'+m.month+'-'+m.year+" ";
	// var min = m.min>10?m.min:'0'+m.min;
	// var mSec = m.sec>10?m.sec:'0'+m.sec;
	// var mTime = (m.hour>=12)?m.hour-12+':'+min+'PM':m.hour+':'+min+' AM';
	// var hDate = helpers.humanDate(new Date(m.year,m.month-1,m.day,m.hour,parseInt(m.min),parseInt(m.sec)));

	var det =function(){
	    var name = m.hasOwnProperty("to")?"<span onclick='showConversation(this)'>me, <em class='details'>"+m.to+"</em></span>":"<span onclick='showConversation(this)' class='details'><em>"+m.f+"</em></span>";
	    if(!m.m.p) return name;
	    if(!m.m.p.hasOwnProperty("pic")) return name;
	    if(m.m.p.hasOwnProperty("pic")){ 
		if(m.hasOwnProperty("to"))return '<a href="/editprofile.html"><img  class="img-span" src="'+m.m.p.pic+'"/></a>' + name;
		return '<img onclick="showContact(this)"  class="img-span" src="'+m.m.p.pic+'"/>' + name;
	    }
	    return '';
	};
	
	var msg = helpers.output(m.m.m);
	var tag = m.m.t?m.m.t:'';
	if(tag)save(tag,"tags");
	save(m.f,"sent");
	var ms = '<div class="messageBody" data-to="'+m.f+'" data-tag="'+tag+'"><hr style="border-color:#fff; margin-bottom:0px;"/><p><span>'+det()+'</span></p><span>'+msg+'</span><p><span class="details" onclick="showTag(this)">'+tag +'</span></p><p><button onclick="addCommentBox(this)">reply</button></p></div></div>';
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
	url: '/checkuser?name='+e.value,
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
    btnSend.disabled = true;
    if(!e.value) return;
    var ajaxObject = {
	url: '/checkuser?name='+e.value,
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

var showUnread = function(e){
    helpers.hide(e);
    helpers.buildMessages();
};

var search = function(e){
    
    var term = e.value;
    var searchResult = helpers.id("searchResult");
    searchResult.innerHTML = '';
    if(term.charAt(0)==="@"&&term.length>=2){
	
	var res = searchTerm("sent",term.slice(1,term.length).trim());
	searchResult.innerHTML = '<ul style="list-style:none">'+res+'</ul>';
    }
    if(term.charAt(0)==="#"&&term.length>=2){
	var result = searchTerm("tags",term.slice(1,term.length).trim());
	
	searchResult.innerHTML = '<ul style="list-style:none">'+result+'</ul>';
    }
};

function searchTerm(key,term){
    var items = JSON.parse(localStorage.getItem(key));
    var length = items.length;
    var i = 0;
    var li = '';
    for(i;i<length;i++){
	if(items[i].indexOf(term)!=-1&&key==="tags") li+='<li class="details" data-tag="'+items[i]+'"onclick="showTag(this)">'+items[i]+'</li>';

	if(items[i].indexOf(term)!=-1&&key==="sent") li+='<li class="details" data-to="'+items[i]+'"onclick="showConversation(this)">'+items[i]+'</li>';
    }
    return li;
}

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
    if(!message){
	e.parentNode.parentNode.innerHTML += '<p>The message can not be empty</p>';   
	return;
    }
    var messagePacket = {"to":to, "m":{'t':tags,m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    var packet =  helpers.saveMessage(buildDate(messagePacket),to);
    save(to,"sent");
    if(tags)save(tags,"tags");
    messages.innerHTML = domElements.incomingMessage(packet)+messages.innerHTML; 
    showActivity();
    return;
};


function reply(e){
    var parent = e.parentNode.parentNode.parentNode;
    var to = parent.getAttribute("data-to");
    var tags = parent.getAttribute("data-tag");
    var sendError = helpers.id("sendError");
    if(sendError)helpers.hide(sendError);
    var temp = document.createElement("div");
    temp.innerHTML = document.getElementsByName("reply")[0].value;
    var message = temp.innerText||temp.textContent;
    if(!message){
	e.parentNode.parentNode.innerHTML += '<p>The message can not be empty</p>';
	return;
    }
    var messagePacket = {"to":to, "m":{'t':tags,m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    e.parentNode.parentNode.innerHTML = '<button  onclick = "addCommentBox(this)">reply</button>';
    var packet=  helpers.saveMessage(buildDate(messagePacket),to);
    messages.innerHTML = domElements.incomingMessage(packet)+messages.innerHTML;
    showActivity();
    menu.scrollIntoView();
    return;
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
    if(!exists && item){
	var a = [];
	a.push(item);
	exists = JSON.stringify(a);
	localStorage.setItem(key,exists);
	return;
    }
    if(exists && item){
	var parsed = JSON.parse(exists);
	if(parsed.indexOf(item)<0){
	    parsed.push(item);	    
	    localStorage.setItem(key,JSON.stringify(parsed));
	}
	return;
    }   
}

function buildDate(messagePacket){
    var date = new Date();
    messagePacket.month = date.getMonth()+1;
    messagePacket.day = date.getDate();
    messagePacket.year = date.getFullYear();
    messagePacket.min = date.getMinutes();
    messagePacket.hour = date.getHours();
    messagePacket.sec = date.getSeconds();
    return messagePacket;
}

function showConversation(e){
    var to = e.getAttribute("data-to") 
	    ||e.parentNode.parentNode.parentNode.getAttribute("data-to")
	    ||e.parentNode.parentNode.getAttribute("data-to");

    sIn.value='';
    helpers.id("searchResult").innerHTML='';
    helpers.hideM([sendMessage,messages,contactDiv]);
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
    
    cursor.onsuccess = function(e){
	var item = e.target.result;

	if(item && count!=20){
	    item.continue();
	    mStr = mStr + domElements.incomingMessage(item.value);
	    count++;
	}
	if(!item||count===20){
	    var pSpan = '<span class="details" data-to="'+to+'" onclick=showContact(this)>'+to+'</span>';
	    var heading = '<h1 class="center-div">Your conversation with '+pSpan+'</h1>';
	    var needMore = count===20?'<p style="text-align:center" class="details" onclick="moreBIndex('+1+",'"+to+"',this)"+'">more</p>':'';
	    conversation.innerHTML = heading+mStr+needMore;
	    menu.scrollIntoView();
	}
    };
}

function moreBIndex(end,to,e){  
    helpers.hide(e);
    var messageStore = getStore('messages','readonly');
    var mIndex = messageStore.index("between");
    var count = 0;
    var mStr =[];
    var keyRange = IDBKeyRange.only(to);
    var cursor = mIndex.openCursor(keyRange,'prev');
    var skip = (end*20);
    var nextCount = 20*(end+1);
    cursor.onsuccess = function(e){
	var cursor = e.target.result;
	if(count===nextCount||!cursor){
	    console.log(cursor);
	    var needMore = count>=nextCount?function(){
		end++;
		return '<p style="text-align:center" class="details" onclick="moreTagsIndex('+end+",'"+to+"',this)"+'">more</p>';
	    }():'';
	    conversation.innerHTML =  conversation.innerHTML+ mStr.join('')+needMore;
	    return;
	    
	}
	
	if(cursor){
	  
	   if(count>=skip) mStr.push(domElements.incomingMessage(cursor.value));
	    cursor.continue();
	    count++;
	}  
	
    };
}

function showContact(e){
    helpers.hideM([sendMessage,messages,conversation]);
    helpers.show(contactDiv);
    var of = e.parentNode.parentNode.parentNode.getAttribute("data-to")
	    ||e.getAttribute("data-to");
    buildContactProfile(of,e);
}

function buildContactProfile(of,e){
    
    var mStore = getStore('messages','readonly');
    var mIndex = mStore.index("profile");
    var keyRange = IDBKeyRange.only(of);
    var cursor = mIndex.openCursor(keyRange,'prev');
    cursor.onsuccess = function(e){
	var item = e.target.result.value;
	contactDiv.innerHTML='';
	if(item.m.p.hasOwnProperty("pic"))contactDiv.innerHTML = contactDiv.innerHTML+ "<img src = '"+item.m.p.pic+"'/>";
	contactDiv.innerHTML = contactDiv.innerHTML+ '<p class="details" onclick="showConversation(this)" data-to="'+of+'">user: ' +of+'</p>';
	if(item.m.p.hasOwnProperty("n")) contactDiv.innerHTML = contactDiv.innerHTML + '<p>Name: ' +item.m.p.n+'</p>';
	if(item.m.p.hasOwnProperty("a")){ 
	    var about = item.m.p.a;
	    var temp = document.createElement("div");
	    temp.innerHTML = about;   
	    var sanatized = temp.innerText||temp.textContent;
	    contactDiv.innerHTML = contactDiv.innerHTML + '<p>about: '+helpers.output(sanatized)+'</p><hr>';
	}
	
    };
}


function messageBox(){
helpers.hideM([messages,conversation,tagDiv,contactDiv]);
sendMessage.innerHTML = domElements.sendMessage;
helpers.show(sendMessage);
};


function  showActivity(){
    helpers.hideM([sendMessage,conversation,contactDiv]);
    helpers.show(messages);
    menu.scrollIntoView();
};



function morePagesIndex(end,e){  
    helpers.hide(e);
    var messageStore = getStore('messages','readonly');
    var count = 0;
    var mStr =[];
    console.log(typeof mStr);
    messageStore.openCursor().onsuccess = function(e){
	var cursor = e.target.result;
	if(end>20)cursor.skip(20-end);
	console.log(cursor.key);
	if(count===end-1||!cursor){
	    if(!count){
		return;
	    }
	    if(count){
		var needMore = count===20?'<p style="text-align:center" class="details" onclick="morePagesIndex('+cursor.key+',this)">more</p>':'';
		messages.innerHTML = messages.innerHTML+ mStr.reverse().join('')+needMore;
		return;
	    }
	}
	
	if(cursor){
	   
	    mStr.push(domElements.incomingMessage(cursor.value));
	    cursor.continue();
	    count++;
	}  
	
    };
}
