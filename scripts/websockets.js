var socketManager  = function(sess){

    var socket = new WebSocket('ws://localhost:3000/websocket/'+sess);
    socket.onopen = function(data){
	
    };
    socket.onmessage = function(e){
    };
    socket.onerror = function(e){

	messageDiv.innerHTML='<p>Could not connect to the server</p>';
	console.log(messageDiv);
    };
    return socket;
};
