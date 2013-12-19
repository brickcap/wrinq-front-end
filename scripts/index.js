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
    ajax: function(options){
	var request = new XMLHttpRequest();
	request.open(options.method,options.url,true);
	request.onreadystatechange = function(){
	    if(request.status!=200||request.readyState!=4)return;

	    options.callback(request.responseText);
	};
	if(options.method==="POST"||options.method==="PUT")request.send(options.data);
	request.send();
    }

};


var domElements = {

    'signUpForm' :'<form  id ="signUpForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder= "username" onfocusout="checkUser(this)" onfocus = "clearMessages()" required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="createButton"  value="sign up"/></p></form><p id ="message"></p><p><span class ="underline-spans" onclick = "loginClick()">or login<span></p>',

    'loginForm': '<form  method="POST" id="loginForm"><p><input type="text" name="username" value="" placeholder="username"  required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" name="" value="login"/></p></form><p ><span class ="underline-spans" onclick ="signUpClick()">or sign-up<span></p>'

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
    var formData = helpers.serializeTextFields(form);
    
    var ajaxObject = {
	url: "/createuser",
	data : formData,
	method: "POST",
	callback: function(response){
	    //web sockets go here
	}
    };
    helpers.ajax(ajaxObject);

};

var checkUser = function(input){
    var createButton = helpers.id("createButton");
    var message = helpers.id("message");
    var ajaxObject = {
	url: '/checkuser?name="'+input.value+'"',
	method: 'GET',
	callback:function(response){
	    
	    if(JSON.parse(response).available) return;
	    else{
		createButton.disabled = true;
		message.innerHTML = "The username is taken";
	    }
	}
    };
    helpers.ajax(ajaxObject);
};

var clearMessages = function(){
    var createButton = helpers.id("createButton");
    var message = helpers.id("message");
    message.innerHTML = '';
    createButton.disabled = false;
};
