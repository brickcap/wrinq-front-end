function  showActivity(){
    helpers.hideM([sendMessage,conversation,tagDiv]);
    helpers.show(messages);
    menu.scrollIntoView();
};



function morePagesIndex(end,e){  
    helpers.hide(e);
    var messageStore = getStore('messages','readonly');
    var count = 0;
    var mStr ='';	
    messageStore.openCursor().onsuccess = function(e){
	var cursor = e.target.result;
	if(end>20)cursor.skip(20-end);
	console.log(cursor.key);
	if(count===end-1||!cursor){
	    if(!count){
		return;
	    }
	    if(count){
		var needMore = count===20? function(){ 
		    return '<p style="text-align:center" class="details" onclick="morePagesIndex('+cursor.key+',this)">more</p>';
		}():'';
		messages.innerHTML = messages.innerHTML+ mStr+needMore;
		return;
	    }
	}
	
	if(cursor){
	   
	    mStr = mStr+domElements.incomingMessage(cursor.value);
	    cursor.continue();
	    count++;
	}  
	
    };
}
