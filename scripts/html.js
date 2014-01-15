var domElements = {

    'signUpForm' :'<form  id ="signUpForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder= "username" onblur="checkUser(this)" onfocus = "clearMessages()" required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton"  value="sign up" disabled/></p></form><p id ="message"></p><p><span class ="underline-spans" onclick = "loginClick()">or login<span></p>',

    'loginForm': '<form  method="POST" id="loginForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder="username"  required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton" name="" value="login"/></p></form><p id= "message"></p><p ><span class ="underline-spans" onclick ="signUpClick()">or sign-up<span></p>',

    'commentBox':'<div class="box"><p><textarea rows="5" name="message" placeholder="your message" onkeyup="autoGrow(this)"></textarea></p></div> <span><button type="button" onclick="reply(this)" id="btnReply disabled">post</button></span><span><button type="button" onclick="removeCommentBox(this)">cancel</button>',

    'contact' : function(o){
	var temp = '<div class="contacts"><h1 style="text-align:center;">contacts</h1></div>';
	return temp;
    },
    'sendMessage' : '<div  class="box"><p><input type="text" name="to" placeholder="to" onblur="check(this)"/></p><p><textarea rows="5" placeholder="your message" onkeyup="autoGrow(this)" name="message"></textarea></p><p><input type="text" name="tag" placeholder="tag"/></p></div> <span><button type="button" onclick="send(this)" id="btnSend" disabled>post</button></span>',

    'incomingMessage' : function(m){
	var mDate = m.day+'-'+m.month+'-'+m.year+" ";
	var min = m.min>10?m.min:'0'+m.min;
	var mSec = m.sec>10?m.sec:'0'+m.sec;
	var mTime = (m.hour>=12)?m.hour-12+':'+min+'PM':m.hour+':'+min+' AM';
	var hDate = helpers.humanDate(new Date(m.year,m.month-1,m.day,m.hour,parseInt(m.min),parseInt(m.sec)));
	console.log(hDate);
	var to = m.hasOwnProperty("to")?'to: <span class="details" onclick="showConversation(this)">'+m.to+'</span>':'';
	var det =function(){
	    var name = m.hasOwnProperty("to")?'':m.f+':';
	    if(!m.m.p) return "<span onclick='showConversation(this)' class='details'><em>"+name+"</em></span> ";
	    if(!m.m.p.hasOwnProperty("pic")) return "<span onclick='showConversation(this)' class='details'><em>"+name+"</em></span> ";
	    if(m.m.p.hasOwnProperty("pic")) return "<img  class='img-span' src="+m.m.p.pic+"</img><span class='details' onclick='showConversation(this)'>"+name+"</span>";
	    return '';
	};
	var msg = helpers.output(m.m.m);
	var tag = m.m.t?m.m.t:'';
	if(tag) save(tag,"tags");
	var ms = '<div class="messageBody" data-to="'+m.f+'" data-tag="'+tag+'"><hr style="border-color:#fff"/><p><span>'+det()+'</span><span>'+hDate+' ago</span></p><span>'+msg+'</span><p><span class="details" onclick="showTag(this)">'+tag +'</span>'+to+'</p> <p><button onclick = "addCommentBox(this)">reply</button></p> </div></div>';
	return ms;
    }

};




