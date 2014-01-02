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
};


function send(e){
    var sendError = helpers.id("sendError");
    if(sendError)helpers.hide(sendError);
    var to = document.getElementsByName("to")[0].value;
    var tags = document.getElementsByName("tag")[0].value;
    var message = document.getElementsByName("message")[0].value;
    if(!to||!message){
	e.parentNode.parentNode.innerHTML += '<p id="sendError">There must be a valid username and a non empty message</p>';
	return;
    }
    console.log(to+' '+message+' '+tags);
};

function reply(e){
};
