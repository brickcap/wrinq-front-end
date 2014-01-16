function showTag(e){
    sIn.value='';
    helpers.id("searchResult").innerHTML='';
    var tag = e.getAttribute("data-tag") 
	    || e.parentNode.parentNode.getAttribute("data-tag");
    helpers.hideM([sendMessage,messages,conversation]);
    helpers.show(tagDiv);
    buildTag(tag);
}

function buildTag(t,page){
    var mStore = getStore('messages','readonly');
    var mIndex = mStore.index("tag");
    var keyRange = IDBKeyRange.only(t);
    var cursor = mIndex.openCursor(keyRange,'prev');
    var count = 0;
    var mStr='';
    var pNo = page?page:1;
    //use cursor.advance(int);
    cursor.onsuccess = function(e){
	var item = e.target.result;
	 if(pNo>1) cursor.advance(20*pNo+1);
	if(item && count!=20){
	    item.continue();
	    count++;
	    mStr = mStr + domElements.incomingMessage(item.value);
	}
	if(!item||count===20){
	    var heading = '<h1 class="center-div">Messages Tagged as '+t+'</h1>';
	    var needMore = count===20?'<p style="text-align:center" class="details" data-page="'+pNo+'">more</p>':'';
	    tagDiv.innerHTML = heading+mStr+needMore;
   
	    menu.scrollIntoView();

	}
    };
}

