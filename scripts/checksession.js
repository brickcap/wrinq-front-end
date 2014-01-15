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
	var profile = profileStore.get("master"); 
	profile.onsuccess = function(e){
	    if(!e.target.result){
		messageDiv.innerHTML = '<a href="/editprofile.html">create a profile</a>';
		return;
	    }
	    prf = e.target.result;
	};
	var messageStore = getStore('messages','readonly');
	var count = 0;
	var mStr ='';	
	messageStore.openCursor(null,'prev').onsuccess = function(e){
	    var cursor = e.target.result;
	   
	    if(count===10||!cursor){
		if(!count){
		    var appMessage = helpers.id("appMessage");
		    appMessage.innerHTML = '<p>No recent activity</p>';
		    helpers.show(appMessage);
		}
		if(count){
		    var heading = '<h1 style="text-align:center;">Recent Messages</h1>';
		    messages.innerHTML = heading+mStr; 
		    return;
		}
	    }
	    
	    if(cursor){
		mStr = mStr+domElements.incomingMessage(cursor.value);
		cursor.continue();
		count++;
	    }  
	    
	};
	socket=	socketManager(e.target.result.session);
    };
    
};
