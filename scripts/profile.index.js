// Generated by CoffeeScript 1.6.3
(function() {
  var autoLink,
    __slice = [].slice;

  autoLink = function() {
    var k, linkAttributes, option, options, pattern, v;
    options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    pattern = /(^|\s)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
    if (!(options.length > 0)) {
      return this.replace(pattern, "$1<a href='$2'>$2</a>");
    }
    option = options[0];
    linkAttributes = ((function() {
      var _results;
      _results = [];
      for (k in option) {
        v = option[k];
        if (k !== 'callback') {
          _results.push(" " + k + "='" + v + "'");
        }
      }
      return _results;
    })()).join('');
    return this.replace(pattern, function(match, space, url) {
      var link;
      link = (typeof option.callback === "function" ? option.callback(url) : void 0) || ("<a href='" + url + "'" + linkAttributes + ">" + url + "</a>");
      return "" + space + link;
    });
  };

  String.prototype['autoLink'] = autoLink;

}).call(this);

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
