var socketManager  = function(sess){

    var socket = new WebSocket('ws://localhost:3000/websocket/'+sess);
    socket.onopen = function(data){
	socket.send(JSON.stringify({"ret":1}));
	helpers.show(app);
    };
    socket.onmessage = function(e){
	var message = JSON.parse(e.data);
	if(message.hasOwnProperty("msgs")){
	    var length = message.msgs.length;
	    var i =0;
	    for(i;i<length;i++){
		var m = helpers.addProfile(message[i]);
		helpers.saveMessage(m);
		messages.innerHTML = domElements.incomingMessage(m)+ messages.innerHTML;
	    }
	    socket.send(JSON.stringify({"delmsg":1}));
	    console.log(message);
	}
	helpers.addProfile(message);	
	helpers.saveMessage(message);
	messages.innerHTML = domElements.incomingMessage(message)+ messages.innerHTML;
	return;	
	
    };
    socket.onerror = function(e){

	messageDiv.innerHTML +='<p id="error-message">Could not connect to the server.Try refreshing.</p>';
	helpers.show(app);
    };
    return socket;
};

