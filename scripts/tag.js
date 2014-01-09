function tag(e){
var tag = e.parentNode.parentNode.parentNode.getAttribute("data-tag");
helpers.hide(sendMessage);
helpers.hide(messages);
helpers.hide(conversation);
helpers.show(tag);
buildTag(tag);
}

function buildTag(t){
}
