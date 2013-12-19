
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
    var ajaxObject = {
	url: '/checkuser?name="'+input.value+'"',
	method: 'GET',
	callback:function(response){
	    console.log(response);
	}
    };
    helpers.ajax(ajaxObject);
};
