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
    }

};


var domElements = {

    'signUpForm' :'<form action="" method = "post" id ="signUpForm"><p><input type="text" name="username" value="" placeholder= "username" required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="email" name="email" value="" placeholder="email"/></p><p><input type="submit"  value="sign up"/></p></form><p><span class ="underline-spans" onclick = "loginClick()">or login<span></p>',

    'loginForm': '<form action="" method="post" id="loginForm"><p><input type="text" name="username" value="" placeholder="username"  required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" name="" value="login"/></p></form><p ><span class ="underline-spans" onclick ="signUpClick()">or sign-up<span></p>'

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




