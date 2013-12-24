var logincallback = {
    successCallback: function(responseText){
	helpers.hide(formDiv);
	addToAppStore({"session":responseText},"");
    },
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "Login failed.";
    }
};
