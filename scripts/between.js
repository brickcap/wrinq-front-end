function conversation(between){
helpers.hide(sendMessage);
helpers.hide(messages);
    helpers.show(conversation);
};


function buildMessages(between){
    var messageStore = getStore('messages','readonly');
    var messageIndex = messages.index("between");
    var keyRange = IDBKeyRange.bound(['',between],[between,'']);
    var cursor = messageStore.openCursor(keyRange,'prev');
    var count = 0;    
    cursor.onsuccess = function(e){
	var item = e.targe.result;
    };
}
