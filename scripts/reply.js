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
    var messageBox =helpers.id("messageBox");
    if(!messageBox.value)return;
    var userRegex = /\B(@[^ ]+)/g;
    var hashRegex = /\B(#[^ ]+)/g;
    var newline = /(\n)/g;
   var output = messageBox.value.replace(userRegex,'<span class="underline-spans">$1</span> ').replace(hashRegex,'<span class="underline-spans">$1</span> ').replace(newline,"<br/>");
    helpers.hide(messageBox);
    helpers.id("preview").disabled = true;
    helpers.id("showEdit").disabled=false;
    helpers.id("previewDiv").innerHTML = output;
    return;
};

function showEdit(e){
    var mb = helpers.id("messageBox");    
    var previewDiv = document.getElementById("previewDiv");
    helpers.hide(previewDiv);
    helpers.id("showEdit").disabled = true;
    helpers.id("preview").disabled=false;
    helpers.show(mb);
    return;
};
