var socketManager  = function(sess){

    var socket = new WebSocket('ws://localhost:3000/websocket/'+sess);
    socket.onopen = function(data){
	helpers.show(app);
    };
    socket.onmessage = function(e){
	var message = JSON.parse(e.data);
	if(message.hasOwnProperty("m")){
	    var contactInfo = message.m.p; 
	    if(!contactInfo){
		helpers.saveMessage(message);
		return;
	    }
	    var messageToSave = message;
	    delete messageToSave.m.p;
	    helpers.saveMessage(messageToSave);
	    if(message.m.p){
		messages.innerHTML = html.incomingMessage(message)+ messages.innerHTML;
		addToStore('profile',null,message.m.p); 
	    }
	    if(!message.m.p){
		var pStore = getStore("profile",null,'readonly');
		var pIndex = pStore.index("name");
		var request = index.get(message.f);
		request.onsuccess = function(e){
		    var result = e.target.result;
		    message.m.p = result;
		    messages.innerHTML = html.incomingMessage(message)+messages.innerHTML;
		};
	    }
	}
    };
    socket.onerror = function(e){

	messageDiv.innerHTML +='<p id="error-message">Could not connect to the server.Try refreshing.</p>';
	helpers.show(app);
    };
    return socket;
};

