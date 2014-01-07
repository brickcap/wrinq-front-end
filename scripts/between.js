function showConversation(e){
    var to = e.parentNode.parentNode.parentNode;
    helpers.hide(sendMessage);
    helpers.hide(messages);
    helpers.show(conversation);
    console.log(to);
//    buildMessages(to);
};


function buildMessages(to){
    var messageStore = getStore('messages','readonly');
    var messageIndex = messageStore.index("between");
    var keyRange = IDBKeyRange.bound(['',between],[between,'']);
    var cursor = messageStore.openCursor(keyRange,'prev');
    var count = 0;
    var mStr;
    //Create another index for pagination that accepts the last item name as the index
    cursor.onsuccess = function(e){
	var item = e.target.result;
	if(item){
	    item.continue();
	    mStr = mStr + helpers.incomingMessage(item);
	    count++;
	}
	if(!item||count===10){
	    conservation.innerHTML = mStr;   
	}
    };
}
