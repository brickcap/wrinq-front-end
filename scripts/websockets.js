var socketManager  = function(sess){

    var socket = new WebSocket('ws://localhost:3000/websocket/'+sess);
    socket.onopen = function(data){
	socket.send(JSON.stringify({"ret":1}));
	helpers.show(app);
    };
    socket.onmessage = function(e){
	var message = JSON.parse(e.data);
	if(message.hasOwnProperty("msgs")){
	    socket.send(JSON.stringify({"delmsg":1}));
	    console.log(message);
	}
	if(message.hasOwnProperty("m")){
	    if(!message.m.p){
		message.m.p = {};
		message.m.p.u = message.f;	   
	    }	
	    helpers.saveMessage(message);
	    messages.innerHTML = domElements.incomingMessage(message)+ messages.innerHTML;
	    return;	
	}
    };
    socket.onerror = function(e){

	messageDiv.innerHTML +='<p id="error-message">Could not connect to the server.Try refreshing.</p>';
	helpers.show(app);
    };
    return socket;
};

