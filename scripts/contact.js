var showContacts = function(){
var profileStore = getStore("profile",'readonly');
appMessage.innerHTML="";
appBody.innerHTML =domElements.contact();
};


var addContact = function(element){
appMessage.innerHTML = "";
appBody.innerHTML=domElements.addContact; 
};
