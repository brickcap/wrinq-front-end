function showContact(e){
    helpers.hideM([sendMessage,messages,conversation]);
    helpers.show(contactDiv);
    var of = e.parentNode.parentNode.parentNode.getAttribute("data-to")
	    ||e.getAttribute("data-to");
    buildContactProfile(of,e);
}

function buildContactProfile(of,e){
    
    var mStore = getStore('messages','readonly');
    var mIndex = mStore.index("profile");
    var keyRange = IDBKeyRange.only(of);
    var cursor = mIndex.openCursor(keyRange,'prev');
    cursor.onsuccess = function(e){
	var item = e.target.result.value;
	contactDiv.innerHTML='';
	if(item.m.p.hasOwnProperty("pic"))contactDiv.innerHTML = contactDiv.innerHTML+ "<img src = '"+item.m.p.pic+"'/>";
	contactDiv.innerHTML = contactDiv.innerHTML+ '<p class="details" onclick="showConversation(this)" data-to="'+of+'">user: ' +of+'</p>';
	if(item.m.p.hasOwnProperty("n")) contactDiv.innerHTML = contactDiv.innerHTML + '<p>Name: ' +item.m.p.n+'</p>';
	if(item.m.p.hasOwnProperty("a")) contactDiv.innerHTML = contactDiv.innerHTML + '<p>about: ' +helpers.output(item.m.p.a)+'</p><hr>';
	
    };
}
