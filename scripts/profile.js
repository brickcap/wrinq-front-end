function autoGrow (oField) {
  if (oField.scrollHeight > oField.clientHeight) {
    oField.style.height = oField.scrollHeight + "px";
  }
};

function createImage(text){
    text.autoLink({
	callback: function(url) {
	    return /\.(gif|png|jpe?g)$/i.test(url) ? '<img src="' + url + '">' : null;
	}
    });
};

