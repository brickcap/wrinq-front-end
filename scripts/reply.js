function autoGrow (oField) {
    if (oField.scrollHeight > oField.clientHeight) {
	oField.style.height = oField.scrollHeight + "px";
    }
   
};

function addCommentBox(e){
    e.parentNode.innerHTML = domElements.commentBox;
};

function removeCommentBox(e){
    e.parentNode.parentNode.innerHTML = '<span  class="action-item" title="reply" onclick = "addCommentBox(this)">&lt;\\&gt;</span>';
};


function send(e){
    var sendError = helpers.id("sendError");
    if(sendError)helpers.hide(sendError);
    var to = document.getElementsByName("to")[0].value;
    var tags = document.getElementsByName("tag")[0].value;
    var message = document.getElementsByName("message")[0].value;
    if(!to||!message){
	e.parentNode.parentNode.innerHTML += '<p id="sendError">There must be a valid username and a non empty message</p>';   
 }
    var messagePacket = {"to":to, "msg":{'t':tags,m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    helpers.saveMessage(messagePacket);
    return;
};


function reply(e){
var sendError = helpers.id("sendError");
 if(sendError)helpers.hide(sendError);
    var message = document.getElementsByName("message")[0].value;
    if(!message){
	e.parentNode.parentNode.innerHTML += '<p id="sendError">The message can not be empty</p>';
	return;
    }

};

function buildProfile(to,messagePacket){
    var result = profile.result;
    
    if(result && result.sent.indexOf(to)===-1){
	
	var p = {"n":result.name,"pic":result.pic,"a":result.about};
	messagePacket.msg.p = p;
	return messagePacket;
    }
    return messagePacket;
};

