function showConversation(e){
    var to = e.parentNode.parentNode.parentNode.getAttribute("data-to");
    helpers.hide(sendMessage);
    helpers.hide(messages);
    helpers.show(conversation);
    console.log(to);
    buildMessages(to);
};


function buildMessages(to){
    var messageStore = getStore('messages','readonly');
    var messageIndex = messageStore.index("between");
    var keyRange = IDBKeyRange.only(to);
    var cursor = messageIndex.openCursor(keyRange,'prev');
    var count = 0;
    var mStr;
    //use cursor.advance(int);
    cursor.onsuccess = function(e){
	var item = e.target.result;
	console.log(item);
	if(item){
	    item.continue();
	    mStr = mStr + helpers.incomingMessage(item);
	    count++;
	}
	if(!item||count===10){
	   conversation.innerHTML = mStr;   
	}
    };
}
