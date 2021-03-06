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
    var temp = document.createElement("div");
    temp.innerHTML = document.getElementsByName("message")[0].value;
    var message = temp.innerText||temp.textContent;
    if(!message){
	e.parentNode.parentNode.innerHTML += '<p>The message can not be empty</p>';   
	return;
    }
    var messagePacket = {"to":to, "m":{m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    var packet =  helpers.saveMessage(buildDate(messagePacket),to);
    save(to,"sent");
    messages.innerHTML = domElements.incomingMessage(packet)+messages.innerHTML; 
    showActivity();
    return;
};


function reply(e){
    var parent = e.parentNode.parentNode.parentNode;
    var to = parent.getAttribute("data-to");
    var sendError = helpers.id("sendError");
    if(sendError)helpers.hide(sendError);
    var temp = document.createElement("div");
    temp.innerHTML = document.getElementsByName("reply")[0].value;
    var message = temp.innerText||temp.textContent;
    if(!message){
	e.parentNode.parentNode.innerHTML += '<p>The message can not be empty</p>';
	return;
    }
    var messagePacket = {"to":to, "m":{m:message}};
    var messageProfile = buildProfile(to,messagePacket);
    socket.send(JSON.stringify(messageProfile));
    e.parentNode.parentNode.innerHTML = '<button  onclick = "addCommentBox(this)">reply</button>';
    var packet=  helpers.saveMessage(buildDate(messagePacket),to);
    messages.innerHTML = domElements.incomingMessage(packet)+messages.innerHTML;
    showActivity();
    menu.scrollIntoView();
    return;
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
    if(!exists && item){
	var a = [];
	a.push(item);
	exists = JSON.stringify(a);
	localStorage.setItem(key,exists);
	return;
    }
    if(exists && item){
	var parsed = JSON.parse(exists);
	if(parsed.indexOf(item)<0){
	    parsed.push(item);	    
	    localStorage.setItem(key,JSON.stringify(parsed));
	}
	return;
    }   
}

function buildDate(messagePacket){
    var date = new Date();
    messagePacket.month = date.getMonth()+1;
    messagePacket.day = date.getDate();
    messagePacket.year = date.getFullYear();
    messagePacket.min = date.getMinutes();
    messagePacket.hour = date.getHours();
    messagePacket.sec = date.getSeconds();
    return messagePacket;
}
