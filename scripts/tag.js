function showTag(e){
    var tag = e.parentNode.parentNode.getAttribute("data-tag");
    helpers.hideM([sendMessage,messages,conversation]);
    helpers.show(tagDiv);
    buildTag(tag);
}

function buildTag(t){
    console.log(t);
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
	    count++;
	    mStr = mStr + domElements.incomingMessage(item.value);
	}
	if(!item||count===10){
	    var heading = '<h1 class="center-div">Messages Tagged as '+t+'</h1>';
	    tagDiv.innerHTML = heading+mStr;   
	    tagDiv.scrollIntoView();

	}
    };
}

