function showConversation(e){
    var to = e.parentNode.parentNode.parentNode.getAttribute("data-to");
    helpers.hide(sendMessage);
    helpers.hide(messages);
    helpers.show(conversation);
    var pStore = getStore('profile','readonly');
    var pIndex = pStore.index("name");
    var request = pIndex.get(to);
    request.onsuccess = function(e){
	var p = e.target.result;
	 buildMessages(to,p);
    };
   
};


function buildMessages(to,p){
    var mStore = getStore('messages','readonly');
    var mIndex = mStore.index("between");
    var keyRange = IDBKeyRange.only(to);
    var cursor = mIndex.openCursor(keyRange,'prev');
    var count = 0;
    var mStr='';
    //use cursor.advance(int);
    cursor.onsuccess = function(e){
	var item = e.target.result;
	if(item){
	    item.continue();
	    item.value.m.p = p;
	    mStr = mStr + domElements.incomingMessage(item.value);
	    count++;
	}
	if(!item||count===10){
	    conversation.innerHTML = mStr;   
	}
    };
}
