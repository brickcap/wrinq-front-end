var checkSession = function(){
    var storeApp = getStore('application','readonly');
    var result =  storeApp.get(1);
    
    result.onsuccess = function(e){
	console.log(e);
	if(!e.target.result) helpers.show(splashDiv);
	else helpers.hide(splashDiv);
    };
    
};
