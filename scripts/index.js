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
    ajaxPost: function(options){
	var request = new XMLHttpRequest();
	request.open("POST",options.url,true);
	request.setRequestHeaders("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	request.send(options.data);
	request.onreadystatechange = function(){
	    if(request.state!=4||request.status!=200)return;
	    options.callback(request.responseText);
	};
    }

};


var domElements = {

    'signUpForm' :'<form  method = "POST" id ="signUpForm"><p><input type="text" name="username" value="" placeholder= "username" required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="email" name="email" value="" placeholder="email"/></p><p><input type="submit"  value="sign up"/></p></form><p><span class ="underline-spans" onclick = "loginClick()">or login<span></p>',

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




