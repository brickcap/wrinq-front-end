var createcallback = {
    successCallback: function(responseText){
	helpers.hide(formDiv);
    },
    errorCallback : function(){
	var message = helpers.id("message");
	message.innerHTML = "This action could not be completed";
    }
};
