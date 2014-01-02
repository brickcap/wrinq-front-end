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
	profile = profileStore.get("master"); 
	profile.onsuccess = function(e){
	    if(!e.target.result){
		messageDiv.innerHTML = '<a href="/editprofile.html">create a profile</a>';
		return;
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
	socket=	socketManager(e.target.result.session);
    };
    
};
