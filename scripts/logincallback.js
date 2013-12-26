var logincallback = {
    successCallback: function(responseText){
	storeObject = addToStore({"session":responseText},"sess","application");
	storeObject.oncomplete = function(){
	    checkSession();
	};
	
    },
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "Login failed.";
    }
};
