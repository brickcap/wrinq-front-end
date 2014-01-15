var socketManager  = function(sess){

    var socket = new WebSocket('ws://localhost:3000/websocket/'+sess);
    socket.onopen = function(data){
	socket.send(JSON.stringify({"ret":1}));
	helpers.show(app);
    };
    socket.onmessage = function(e){
	var message = JSON.parse(e.data);
	if(message.hasOwnProperty("msgs") && message.msgs.length>0){
	    
	    var messageArray = message.msgs;	    
	    var length = messageArray.length;
	    var i =0;
	    var mStr = '';
	    for(i;i<length;i++){
		
		var parsed = JSON.parse(messageArray[i]);
		var m = helpers.addProfile(parsed);
		helpers.saveMessage(m);
		console.log(m);
		messages.innerHTMl = domElements.incomingMessage(m) + messages.innerHTMl;
	    }
	   
	    socket.send(JSON.stringify({"delmsg":1}));
	    return;
	}
	if(message.hasOwnProperty("m")){
	    helpers.addProfile(message);	
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

