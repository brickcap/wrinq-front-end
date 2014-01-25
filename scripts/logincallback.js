var logincallback = {
    successCallback: function(responseText){
        helpers.hide(formDiv);
        addToAppStore({"session":responseText},"sess");
        checkSession();
    },
    errorCallback : function(){
        var message = helpers.id("message");
        message.innerHTML = "Login failed.";
    }
};
