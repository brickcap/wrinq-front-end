var helpers = {

    id : function(id){
	return document.getElementById(id);
    },
    show : function(element){
	element.style.display="block";
    },

    hide : function(element){
	element.style.display = "none";
    },
    clearHtml :function(element){
	element.innerHTML = '';
    },

    serializeTextFields : function(form){
	
	var i=0;
	var length= form.elements.length -1;
	var data = "";
	for(i;i<length;i++){
	    var name = form.elements[i].name;
	    var value = form.elements[i].value;
	    var pair = name+'='+value+'&';
	    data = data+encodeURI(pair); 
	}
	return data;	
    },
    ajaxPost: function(options){
	var request = new XMLHttpRequest();
	request.open("POST",options.url,true);
	request.onreadystatechange = function(){
	    if(request.status!=200||request.readyState!=4)return;

	    options.callback(request.responseText);
	};
	request.send(options.data);
    }

};

