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
	 delete message.m.p;
	 helpers. saveMessage(message);
	// saveContact(contactInfo);   
	}
    };
    socket.onerror = function(e){

	messageDiv.innerHTML +='<p id="error-message">Could not connect to the server.Try refreshing.</p>';
	console.log(app);	
	helpers.show(app);
    };
    return socket;
};

