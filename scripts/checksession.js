var checkSession = function(){
    var storeApp = getStore('application','readonly');
    var result =  storeApp.get(1);
    
    result.onsuccess = function(e){
	
	if(!e.target.result) helpers.show(splashDiv);
	helpers.hide(splashDiv);
	socketManager(e.targe.result);
    };
    
};
