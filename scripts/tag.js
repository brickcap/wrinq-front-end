function showTag(e){
    var tag = e.parentNode.parentNode.getAttribute("data-tag");
    helpers.hide(sendMessage);
    helpers.hide(messages);
    helpers.hide(conversation);
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
	console.log(item);
	if(item && count!=10){
	    item.continue();
	    addProfile(item,mStr);
	}
	if(!item||count===10){
	    var heading = '<h1 class="center-div">Messages Tagged as '+t+'</h1>';
	    tagDiv.innerHTML = heading+tagDiv.innerHTML;   
	}
    };
}

function addProfile(item,str){
    console.log(str);
    var pStore = getStore('profile','readonly');
    var pIndex = pStore.index("name");
    if(item.hasOwnProperty("to")){
	item.value.m.p = prf;
	str = str + domElements.incomingMessage(item.value);
	 tagDiv.innerHTML = str + tagDiv.innerHTML; 
    }
    var result = pIndex.get(item.value.f);
    result.onsuccess = function(e){
	item.value.m.p = e.target.result;
	str = str + domElements.incomingMessage(item.value);
	tagDiv.innerHTML = str + tagDiv.innerHTML;
    }; 
}
