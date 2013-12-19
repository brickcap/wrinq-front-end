
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
    console.log(event);
     var formData = helpers.serializeTextFields(form);
    
    var ajaxObject = {
	url: "/createuser",
	data : formData,
	method: "POST",
	callback: function(response){
	   //web sockets go here
	}
    };
    helpers.ajaxPost(ajaxObject);

};

var checkUser = function(input){
};
