var createcallback = {
    successCallback: function(responseText){
	splashDiv.display = none;
    },
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "Login failed.";
    }
};
