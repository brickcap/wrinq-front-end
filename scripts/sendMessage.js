function messageBox(){
helpers.hide(appMessage);
helpers.hide(messages);
helpers.hide(conversation);
helpers.hide(tagDiv);
sendMessage.innerHTML = domElements.sendMessage;
helpers.show(sendMessage);
};

