function showTag(e){
    sIn.value='';
    helpers.id("searchResult").innerHTML='';
    var tag = e.getAttribute("data-tag") 
	    || e.parentNode.parentNode.getAttribute("data-tag");
    helpers.hideM([sendMessage,messages,conversation,contactDiv]);
    helpers.show(tagDiv);
    buildTag(tag);
}

function buildTag(t){
    var mStore = getStore('messages','readonly');
    var mIndex = mStore.index("tag");
    var keyRange = IDBKeyRange.only(t);
    var cursor = mIndex.openCursor(keyRange,'prev');
    var count = 0;
    var mStr='';
   
    cursor.onsuccess = function(e){
	var item = e.target.result;
	if(item && count!=20){
	    item.continue();
	    count++;
	    mStr = mStr + domElements.incomingMessage(item.value);
	}
	if(!item||count===20){
	    var heading = '<h1 class="center-div">Messages Tagged as '+t+'</h1>';
	    var needMore = count===20?'<p style="text-align:center" class="details" onclick="moreTagsIndex('+1+",'"+t+"',this)"+'">more</p>':'';
	    tagDiv.innerHTML = heading+mStr+needMore;
   
	    menu.scrollIntoView();

	}
    };
}

function moreTagsIndex(end,t,e){  
    helpers.hide(e);
    var messageStore = getStore('messages','readonly');
    var mIndex = messageStore.index("tag");
    var count = 0;
    var mStr =[];
    var keyRange = IDBKeyRange.only(t);
    var cursor = mIndex.openCursor(keyRange,'prev');
    var skip = (end*20);
    var nextCount = 20*(end+1);
    cursor.onsuccess = function(e){
	var cursor = e.target.result;
	if(count===nextCount||!cursor){
	    console.log(cursor);
	    var needMore = count>=nextCount?function(){
		end++;
		return '<p style="text-align:center" class="details" onclick="moreTagsIndex('+end+",'"+t+"',this)"+'">more</p>';
	    }():'';
	   tagDiv.innerHTML = tagDiv.innerHTML+ mStr.join('')+needMore;
	    return;
	    
	}
	
	if(cursor){
	  
	   if(count>=skip) mStr.push(domElements.incomingMessage(cursor.value));
	    cursor.continue();
	    count++;
	}  
	
    };
}
