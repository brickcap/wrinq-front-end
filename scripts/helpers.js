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
	request.setRequestHeaders("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	request.send(options.data);
	request.onreadystatechange = function(){
	    if(request.state!=4||request.status!=200)return;
	    options.callback(request.responseText);
	};
    }

};

