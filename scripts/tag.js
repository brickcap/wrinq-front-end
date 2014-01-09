function showTag(e){
var tag = e.parentNode.parentNode.getAttribute("data-tag");
helpers.hide(sendMessage);
helpers.hide(messages);
helpers.hide(conversation);
helpers.show(tagDiv);
//buildTag(tag);
}

function buildTag(t){
    var mStore = getStore('messages','readonly');
    var mIndex = mStore.index("tag");
    var keyRange = IDBKeyRange.only(t);
    var cursor = mIndex.openCursor(keyRange,'prev');
    var count = 0;
    var mStr='';
    //use cursor.advance(int);
    cursor.onsuccess = function(e){
	var item = e.target.result;
	if(item && count!=10){
	    item.continue();
	    item.value.m.p = p;
	    mStr = mStr + domElements.incomingMessage(item.value);
	    count++;
	}
	if(!item||count===10){
	    var heading = '<h1 class="center-div">Messages Tagged as '+t+'</h1>';
	    conversation.innerHTML = heading+mStr;   
	}
    };
}
