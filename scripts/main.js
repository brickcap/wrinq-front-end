var signUpClick = function(){
helpers.hide(splashDiv);
formDiv.innerHTML = domElements.signUpForm;
helpers.show(formDiv);
};

var loginClick = function(){
    helpers.hide(splashDiv);
    formDiv.innerHTML= domElements.loginForm;
    helpers.show(formDiv);
};

var submitAjax = function(e,f){
    e.preventDefault();   
    var fData = helpers.serializeTextFields(f);   
    helpers.ajax(helpers.buildAjaxPostObject(f,fData));
};

var checkUser = function(e){
    var submitButton = helpers.id("submitButton");
    var message = helpers.id("message");
    submitButton.disabled = true;
    if(!e.value) return;
    var ajaxObject = {
	url: '/checkuser?name="'+e.value+'"',
	method: 'GET',
	successCallback:function(response){
	    
	    if(JSON.parse(response).available){
		submitButton.disabled = false;
		return;
	    } 
	    else{
		submitButton.disabled = true;
		message.innerHTML = "The username is taken";
	    }
	}
    };

    helpers.ajax(ajaxObject);
};
function check(e){
    btnSend.disabed = true;
    if(!e.value) return;
    var ajaxObject = {
	url: '/checkuser?name="'+e.value+'"',
	method: 'GET',
	successCallback:function(response){
	    
	    if(JSON.parse(response).available){
		
		return;
	    } 
	    else{
		btnSend.disabled = false;
	    }
	}
    };

    helpers.ajax(ajaxObject);
}
var clearMessages = function(){
    var message = helpers.id("message");
    message.innerHTML = '';
    
};

var showUnread = function(e){
    helpers.hide(e);
    helpers.buildMessages();
};

var search = function(e){
    
    var term = e.value;
    var searchResult = helpers.id("searchResult");
    searchResult.innerHTML = '';
    if(term.charAt(0)==="@"&&term.length>=2){
	console.log("search user");
	var res = searchTerm("sent",term.slice(1,term.length).trim());
	searchResult.innerHTML = '<ul style="list-style:none">'+res+'</ul>';
    }
    if(term.charAt(0)==="#"&&term.length>=2){
	var result = searchTerm("tags",term.slice(1,term.length).trim());
	console.log(result);
	searchResult.innerHTML = '<ul style="list-style:none">'+result+'</ul>';
    }
};

function searchTerm(key,term){
    var items = JSON.parse(localStorage.getItem(key));
    var length = items.length;
    var i = 0;
    var li = '';
    for(i;i<length;i++){
	console.log(items[i]);
	console.log(term);
	if(items[i].indexOf(term)!=-1&&key==="tags") li+='<li class="details" data-tag="'+items[i]+'"onclick="showTag(this)">'+items[i]+'</li>';

	if(items[i].indexOf(term)!=-1&&key==="sent") li+='<li class="details" data-to="'+items[i]+'"onclick="showConversation(this)">'+items[i]+'</li>';
    }
    return li;
}
