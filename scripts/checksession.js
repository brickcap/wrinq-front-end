var checkSession = function(){
    var storeApp = getStore('application','readonly');
    var result =  storeApp.get("sess");
    
    result.onsuccess = function(e){
	
	if(!e.target.result) {
	    helpers.show(splashDiv);
	    return;
	}
	helpers.hide(splashDiv);
	socketManager(e.target.result.session);
    };
    
};
