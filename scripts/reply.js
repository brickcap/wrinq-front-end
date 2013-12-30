function autoGrow (oField) {
    if (oField.scrollHeight > oField.clientHeight) {
	oField.style.height = oField.scrollHeight + "px";
    }
   
};

function addCommentBox(e){
    e.parentNode.innerHTML = domElements.commentBox;
};

function removeCommentBox(e){
    e.parentNode.parentNode.innerHTML = '<span  class="action-item" title="reply" onclick = "addCommentBox(this)">&lt;\\&gt;</span>';
}


function previewText(e){
    var messageBox = e.parentNode.parentNode.getElementsByTagName("textarea")[0];
    if(!messageBox.value)return;
    var userRegex = /\B(@[^ ]+)/g;
    var hashRegex = /\B(#[^ ]+)/g;
    var newline = /(\n)/g;
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var previewDiv =e.parentNode.parentNode.getElementsByTagName("div")[0];
    var output = messageBox.value.replace(userRegex,'<span class="underline-spans">$1</span> ').replace(hashRegex,'<span class="underline-spans">$1</span> ').replace(newline,"<br/>").replace(urlRegex,checkImages);
    helpers.hide(messageBox);
    e.disabled = true;
    document.getElementsByClassName("showEdit")[0].disabled=false;
    helpers.show(previewDiv);
   previewDiv.innerHTML = output;

    return;
};

function showEdit(e){
    var mb = e.parentNode.parentNode.getElementsByTagName("textarea")[0];    
    var previewDiv =e.parentNode.parentNode.getElementsByTagName("div")[0];
    helpers.hide(previewDiv);
    e.disabled = true;
    document.getElementsByClassName("preview")[0].disabled=false;
    helpers.show(mb);
    return;
};

function checkImages(url){

    if (( url.indexOf(".jpg") > 0 )||(url.indexOf(".jpeg") > 0 ) || (url.indexOf(".png") > 0) || (url.indexOf(".gif") > 0)) {
        return '<img src="' + url + '">' + '<br/>';
    } else {
        return '<a href="' + url + '">' + url + '</a>' + '<br/>';
    }
    

};
