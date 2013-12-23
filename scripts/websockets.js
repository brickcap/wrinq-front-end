var socketManager  = function(sess){

    var socket = new WebSocket('ws://localhost:3000/websocket/'+sess);
    socket.onmessage = function(e){
    };
    socket.onerror = function(e){
    };
    return socket;
};
