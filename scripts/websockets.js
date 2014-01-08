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
	 var pStore = getStore("profile",'readonly');
	    var pIndex = pStore.index("name");
 	    var request = pIndex.get(message.f);
	     request.onsuccess = function(e){
		var result = e.target.result;
		 if(hasP){		     
		     messages.innerHTML = domElements.incomingMessage(message)+ messages.innerHTML;
		     message.m.p.u = message.f;
		     addToStore(message.m.p,null,'profile');
		     return;
		 }
		 message.m.p = result;
		 messages.innerHTML = domElements.incomingMessage(message)+messages.innerHTML;
		 return;
	    };	
    };
    socket.onerror = function(e){

	messageDiv.innerHTML +='<p id="error-message">Could not connect to the server.Try refreshing.</p>';
	helpers.show(app);
    };
    return socket;
};

