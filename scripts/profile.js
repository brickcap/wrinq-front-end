 var preview = document.getElementById("imagepreview");
var userName = document.getElementById("name");
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
preview.display = 'block';
preview.innerHTML = '<img id ="profileimage" src="' + url + '">';
userName.focus();
}
