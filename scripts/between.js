function showConversation(e){
    var to = e.getAttribute("data-to") 
	    ||e.parentNode.parentNode.parentNode.getAttribute("data-to")
	    ||e.parentNode.parentNode.getAttribute("data-to");

    sIn.value='';
    helpers.id("searchResult").innerHTML='';
    helpers.hideM([sendMessage,messages,tagDiv]);
    helpers.show(conversation);   
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
	if(item && count!=20){
	    item.continue();
	    mStr = mStr + domElements.incomingMessage(item.value);
	    count++;
	}
	if(!item||count===20){
	    var heading = '<h1 class="center-div">Your conversation with '+to+'</h1>';
	    conversation.innerHTML = heading+mStr;
	    menu.scrollIntoView();
	}
    };
}
