function showContact(e){
    helpers.hideM([sendMessage,messages,conversation]);
    helpers.show(contactDiv);
    var of = e.parentNode.parentNode.parentNode.getAttribute("data-to");
    buildContactProfile(of,e);
}

function buildContactProfile(of,e){
   
    var mStore = getStore('messages','readonly');
    var mIndex = mStore.index("between");
    var keyRange = IDBKeyRange.only(of);
    var cursor = mIndex.openCursor(keyRange,'prev');
    cursor.onsuccess = function(e){
	var item = e.target.result.value;
	console.log(e);
	if(item.m.p.hasOwnProperty("pic"))contactDiv.innerHTML = "<img src = '"+item.m.p.pic+"'/>";
	if(item.m.p.hasOwnProperty("n")) contactDiv.innerHTML = contactDiv.innerHTML + '<p>' +item.m.p.n+'</p>';
	if(item.m.p.hasOwnProperty("a")) contactDiv.innerHTML = contactDiv.innerHTML + '<p>' +item.m.p.a+'</p>';
	console.log(item);
    };
}
