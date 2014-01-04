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
};

