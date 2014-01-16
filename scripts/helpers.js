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

