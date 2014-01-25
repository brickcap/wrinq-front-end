var logincallback = {
    successCallback: helpers.successCallback,
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "Login failed.";
    }
};
