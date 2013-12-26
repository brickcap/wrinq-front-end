var checkSession = function(){
    var storeApp = getStore('application','readonly');
    var result =  storeApp.get("sess");
     
    result.onsuccess = function(e){

	if(!e.target.result) {
	    helpers.show(splashDiv);
	    return;
	}
	helpers.hide(splashDiv);
	helpers.hide(formDiv);
	var profile = storeApp.get("profile");
	profile.onsuccess = function(e){
	    if(!e.target.result){
		messageDiv.innerHTML = '<p class="underline-spans">create a profile</p>';
		
	    }
	};
	var messageStore = getStore('messages','readonly');
	messagesStore.openCursor(null,'prev').onsuccess = function(event){
	    var cursor = event.target.result;
	    var count = 0;
	    if(!cursor||count===10){
		appMessage.innerHTML = '<p>No recent activity</p>';
		appMessage.show();
		return;
	    }
	    count++;
	   cursor.continue();
	};
	socketManager(e.target.result.session);
    };
    
};
