var checkSession = function(){
    var appStore = getStore('application','readonly');
    var result =  appStore.get("sess");     
    result.onsuccess = function(e){

	if(!e.target.result) {
	    helpers.show(splashDiv);
	    return;
	}
	helpers.hide(splashDiv);
	helpers.hide(formDiv);
	var profileStore = getStore("profile",'readonly');
	var profile = profileStore.get("userProfile"); 
	profile.onsuccess = function(e){
	    if(!e.target.result){
		messageDiv.innerHTML = '<p class="underline-spans">create a profile</p>';
		
	    }
	};
	var messageStore = getStore('messages','readonly');
	messageStore.openCursor(null,'prev').onsuccess = function(event){
	    var cursor = event.target.result;
	    var count = 0;
	    if(!cursor||count===10){
		appMessage.innerHTML = '<p>No recent activity</p>';
		helpers.show(appMessage);
		return;
	    }
	    count++;
	   cursor.continue();
	};
	socketManager(e.target.result.session);
    };
    
};
