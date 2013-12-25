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
	socketManager(e.target.result.session);
    };
    
};
