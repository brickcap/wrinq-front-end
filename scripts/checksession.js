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
	var user = localStorage.getItem("user");
	profile.onsuccess = function(e){
	    if(!e.target.result){
		messageDiv.innerHTML = '<a href="/editprofile.html">create a profile '+user+'</a>';
		return;
	    }
	    messageDiv.innerHTML = '<a href="/editprofile.html">'+user+'</a>';
	    prf = e.target.result;
	};
	helpers.buildMessages();
	socket=	socketManager(e.target.result.session);
    };
    
};
