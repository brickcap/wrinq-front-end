var socketManager  = function(sess){

    var socket = new WebSocket('ws://localhost:3000/websocket/'+sess);
    socket.onopen = function(data){
	helpers.show(app);
    };
    socket.onmessage = function(e){
	var message = JSON.parse(e.data);
	if(!message.hasOwnProperty("m"))return;
	helpers.saveMessage(message);
	var hasP = message.m.hasOwnProperty("p"); 
	if(hasP){
	    console.log(message);
	    messages.innerHTML = domElements.incomingMessage(message)+ messages.innerHTML;
	    addToStore(message.m.p,null,'profile'); 
	}
	if(!hasP){
	    var pStore = getStore("profile",'readonly');
	    var pIndex = pStore.index("name");
 	    var request = pIndex.get(message.f);
	     request.onsuccess = function(e){
		var result = e.target.result;
		message.m.p = result;
		 messages.innerHTML = domElements.incomingMessage(message)+messages.innerHTML;
	    };
	}
	
    };
    socket.onerror = function(e){

	messageDiv.innerHTML +='<p id="error-message">Could not connect to the server.Try refreshing.</p>';
	helpers.show(app);
    };
    return socket;
};

