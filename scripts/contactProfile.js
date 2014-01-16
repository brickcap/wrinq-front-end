function showContact(e){
    helpers.hideM([sendMessage,messages,conversation]);
    helpers.show(contactDiv);
    var of = e.parentNode.parentNode.parentNode.getAttribute("data-to");
    buildContactProfile(of);
}

function buildContactProfile(of){
    console.log(of);
    var mStore = getStore('messages','readonly');
    var mIndex = mStore.index("between");
    var keyRange = IDBKeyRange.only(of);
    var cursor = mIndex.openCursor(keyRange,'prev');
    cursor.onsuccess = function(e){
	var item = e.target.result;
	if(!item) return;
	console.log(item);
    };
}
