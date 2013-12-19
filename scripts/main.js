
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
