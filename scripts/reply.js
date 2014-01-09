function autoGrow (oField) {
    if (oField.scrollHeight > oField.clientHeight) {
	oField.style.height = oField.scrollHeight + "px";
    }
   
};

function addCommentBox(e){
    e.parentNode.innerHTML = domElements.commentBox;
};

function removeCommentBox(e){
    e.parentNode.parentNode.innerHTML = '<button  onclick = "addCommentBox(this)">reply</button>';
};


function send(e){
    var to = document.getElementsByName("to")[0].value;
    var tags = document.getElementsByName("tag")[0].value;
    var temp = document.createElement("div");
    temp.innerHTML = document.getElementsByName("message")[0].value;
    var message = temp.innerText||temp.textContent;
    if(!to||!message){
	e.parentNode.parentNode.innerHTML += '<p>The message can not be empty</p>';   
 }
    var messagePacket = {"to":to, "m":{'t':tags,m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    helpers.saveMessage(buildDate(messagePacket),to);
    save(to,"sent");
    if(tags)save(tags,"tags");
    return;
};


function reply(e){
var parent = e.parentNode.parentNode.parentNode.parentNode;
var to = parent.getAttribute("data-to");
var tags = parent.getAttribute("data-tags");
var sendError = helpers.id("sendError");
 if(sendError)helpers.hide(sendError);
    var message = document.getElementsByName("message")[0].value;
    if(!message){
	e.parentNode.parentNode.innerHTML += '<p>The message can not be empty</p>';
	return;
    }
    var messagePacket = {"to":to, "m":{'t':tags,m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    helpers.saveMessage(buildDate(messagePacket),to);
    save(to,"sent");
    if(tags)save(tags,"tags");
};

function buildProfile(to,messagePacket){
    
    if(!prf){ 

	messagePacket.m.p = null;
	return messagePacket;
    }
    var p = {"n":prf.name,"pic":prf.pic,"a":prf.about};
    messagePacket.m.p = p;
    return messagePacket;
    
    return messagePacket;
};

function save(item,key){
    var exists = localStorage.getItem(key);
    if(!exists){
	exists = JSON.stringify([item]);
	console.log(exists);
	localStorage.setItem(key,exists);
	return;
    }
    if(exists){
	var parsed = JSON.parse(exists);
	if(!parsed.indexOf(item)){
	    parsed.push(item);
	    localStorage.setItem(key,JSON.stringify(exists));
	}
	return;
    }   
}

function buildDate(messagePacket){
    var date = new Date();
    messagePacket.month = date.getMonth()+1;
    messagePacket.day = date.getDay();
    messagePacket.year = date.getFullYear();
    messagePacket.min = date.getMinutes();
    messagePacket.hour = date.getHours();
    messagePacket.sec = date.getSeconds();
    return messagePacket;
}
