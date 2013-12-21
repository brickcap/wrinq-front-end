var logincallback = {
    successCallback: function(responseText){
	helpers.hide(formDiv);
    },
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "Login failed.";
    }
};
