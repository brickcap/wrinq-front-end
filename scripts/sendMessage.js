function messageBox(){
helpers.hide(appMessage);
helpers.hide(messages);
helpers.hide(conversation);
sendMessage.innerHTML = domElements.sendMessage;
helpers.show(sendMessage);
};

