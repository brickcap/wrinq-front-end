var preview = document.getElementById("imagepreview");
var userName = document.getElementById("name");
var profilePic = document.getElementById("profilepic");
var about = document.getElementById("abouttext");
var notification = document.getElementById("notification");
var openRequest = indexedDB.open("wrinq", 1);
var database;

function autoGrow (oField) {
    if (oField.scrollHeight > oField.clientHeight) {
	oField.style.height = oField.scrollHeight + "px";
    }
};

function createImage(text){
    preview.innerHTML = "";
    text.autoLink({
	callback: function(url) {
	    return /\.(gif|png|jpe?g)$/i.test(url) ?addImage(url) : null;
	}
    });
};

function addImage(url){
    preview.innerHTML = '<img id ="profileimage" src="' + url + '">';
    userName.focus();
}
openRequest.onsuccess = function(e){
    database = e.target.result;
    var  profileStore = getStore('profile','readonly');
    var result = profileStore.get('master');
    result.onsuccess = function(e){
	var profile = e.target.result;
	document.getElementsByTagName("body")[0].style.display = 'block';	
	if(!profile) return;
	profilePic.value = profile.pic;
	userName.value = profile.name;
	about.value = profile.about;
	if(profilePic.value)addImage(profilePic.value);
    };
   
};



function getStore(objectStore,permission){
    var tran = database.transaction([objectStore],permission);
    var store = tran.objectStore(objectStore);    
    return store;
};

function updateProfile(){
    notification.innerHTML = "";
    var profileStore = getStore('profile','readwrite');
    var image = document.getElementById("profileimage");
    var item = {
	"pic" :image? image.src:"",
	"about" : about.value,
	"name" : userName.value,
	"upgraded":true
    };
    var request = profileStore.put(item,"master");
    request.onsuccess = function(){
	notification.innerHTML = "Profile saved";
    };
    request.onerror = function(e){
	notification.innerHTML = "Could not save profile";
    };
};
