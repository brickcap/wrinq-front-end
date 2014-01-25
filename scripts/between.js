function showConversation(e){
    var to = e.getAttribute("data-to") 
	    ||e.parentNode.parentNode.parentNode.getAttribute("data-to")
	    ||e.parentNode.parentNode.getAttribute("data-to");

    sIn.value='';
    helpers.id("searchResult").innerHTML='';
    helpers.hideM([sendMessage,messages,contactDiv]);
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
    
    cursor.onsuccess = function(e){
	var item = e.target.result;

	if(item && count!=20){
	    item.continue();
	    mStr = mStr + domElements.incomingMessage(item.value);
	    count++;
	}
	if(!item||count===20){
	    var pSpan = '<span class="details" data-to="'+to+'" onclick=showContact(this)>'+to+'</span>';
	    var heading = '<h1 class="center-div">Your conversation with '+pSpan+'</h1>';
	    var needMore = count===20?'<p style="text-align:center" class="details" onclick="moreBIndex('+1+",'"+to+"',this)"+'">more</p>':'';
	    conversation.innerHTML = heading+mStr+needMore;
	    menu.scrollIntoView();
	}
    };
}

function moreBIndex(end,to,e){  
    helpers.hide(e);
    var messageStore = getStore('messages','readonly');
    var mIndex = messageStore.index("between");
    var count = 0;
    var mStr =[];
    var keyRange = IDBKeyRange.only(to);
    var cursor = mIndex.openCursor(keyRange,'prev');
    var skip = (end*20);
    var nextCount = 20*(end+1);
    cursor.onsuccess = function(e){
	var cursor = e.target.result;
	if(count===nextCount||!cursor){
	    console.log(cursor);
	    var needMore = count>=nextCount?function(){
		end++;
		return '<p style="text-align:center" class="details" onclick="moreBIndex('+end+",'"+to+"',this)"+'">more</p>';
	    }():'';
	    conversation.innerHTML =  conversation.innerHTML+ mStr.join('')+needMore;
	    return;
	    
	}
	
	if(cursor){
	  
	   if(count>=skip) mStr.push(domElements.incomingMessage(cursor.value));
	    cursor.continue();
	    count++;
	}  
	
    };
}
