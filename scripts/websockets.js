var socketManager  = function(sess){

    var socket = new WebSocket('ws://localhost:3000/websocket/'+sess);
    socket.onopen = function(data){
	console.log(data);
    };
    socket.onmessage = function(e){
    };
    socket.onerror = function(e){
	console.log(e);
	helpers.show(splashDiv);
    };
    return socket;
};
