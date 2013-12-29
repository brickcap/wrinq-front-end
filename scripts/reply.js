function autoGrow (oField) {
    if (oField.scrollHeight > oField.clientHeight) {
	oField.style.height = oField.scrollHeight + "px";
    }
};

function addCommentBox(element){
element.style.display = 'none';
document.getElementsByClassName("comment")[0].innerHTML = domElements.commentBox;
};
