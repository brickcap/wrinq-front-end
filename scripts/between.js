function showConversation(e){
    var to = e.parentNode.parentNode.parentNode.getAttribute("data-to")||e.parentNode.parentNode.getAttribute("data-to");
    helpers.hide(sendMessage);
    helpers.hide(messages);
    helpers.show(conversation);
    helpers.hide(tagDiv);
    buildMessages(to);
};


function buildMessages(to){
    var mStore = getStore('messages','readonly');
    var mIndex = mStore.index("between");
    var keyRange = IDBKeyRange.only(to);
    var cursor = mIndex.openCursor(keyRange,'prev');
    var count = 0;
    var mStr='';
    //use cursor.advance(int);
    cursor.onsuccess = function(e){
	var item = e.target.result;
	if(item && count!=10){
	    item.continue();
	    mStr = mStr + domElements.incomingMessage(item.value);
	    count++;
	}
	if(!item||count===10){
	    var heading = '<h1 class="center-div">Your conversation with '+to+'</h1>';
	    conversation.innerHTML = heading+mStr;   
	}
    };
}
