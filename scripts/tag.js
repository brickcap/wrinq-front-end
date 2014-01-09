function showTag(e){
var tag = e.parentNode.parentNode.getAttribute("data-tag");
helpers.hide(sendMessage);
helpers.hide(messages);
helpers.hide(conversation);
helpers.show(tagDiv);
console.log(tag);
//buildTag(tag);
}

function buildTag(t){
}
