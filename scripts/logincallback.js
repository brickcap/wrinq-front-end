var logincallback = {
    successCallback: function(responseText){
	storeObject = addToStore({"session":responseText},"sess","application");
	storeObject.transaction.oncomplete = function(){
	    checkSession();
	};
	
    },
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "Login failed.";
    }
};
