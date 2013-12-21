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
    var formData = helpers.serializeTextFields(form);
   
    helpers.ajax(helpers.buildAjaxPostObject(form,formData));

};

var checkUser = function(input){
    var submitButton = helpers.id("submitButton");
    var message = helpers.id("message");
    var ajaxObject = {
	url: '/checkuser?name="'+input.value+'"',
	method: 'GET',
	successCallback:function(response){
	    
	    if(JSON.parse(response).available) return;
	    else{
		submitButton.disabled = true;
		message.innerHTML = "The username is taken";
	    }
	}
    };
    helpers.ajax(ajaxObject);
};

var clearMessages = function(){
    var submitButton = helpers.id("submitButton");
    var message = helpers.id("message");
    message.innerHTML = '';
    submitButton.disabled = false;
};
