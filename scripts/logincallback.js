var logincallback = {
    successCallback: function(responseText){
	helpers.hide(formDiv);
	addStore({"session":responseText},"sess","application");
	checkSession();
    },
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "Login failed.";
    }
};
