var domElements = {

    'signUpForm' :'<form  id ="signUpForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder= "username" onblur="checkUser(this)" onfocus = "clearMessages()" required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton"  value="sign up" disabled/></p></form><p id ="message"></p><p><span class ="underline-spans" onclick = "loginClick()">or login<span></p>',

    'loginForm': '<form  method="POST" id="loginForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder="username"  required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton" name="" value="login"/></p></form><p id= "message"></p><p ><span class ="underline-spans" onclick ="signUpClick()">or sign-up<span></p>',

    'commentBox':'<div class="box"><p><textarea rows="5" name="message" placeholder="your message" onkeyup="autoGrow(this)"></textarea></p></div> <span><button type="button" onclick="reply(this)">post</button></span><span><button type="button" onclick="removeCommentBox(this)">cancel</button>',

    'contact' : function(o){
	var temp = '<div class="contacts"><h1 style="text-align:center;">contacts</h1></div>';
	return temp;
    },
    'addContact' : '<div class="center-div"><input type="text" placeholder="username of the contact"/><p><button>send request</button></p></div>',

    'sendMessage' : '<div  class="box"><p><input type="text" name="to" placeholder="@to"/></p><p><textarea rows="5" placeholder="your message" onkeyup="autoGrow(this)" name="message"></textarea></p><p><input type="text" name="tag" placeholder="#tag  (optional)"/></p></div> <span><button type="button" onclick="send(this)">post</button></span>',

    'incomingMessage' : function(m){
	var mDate = m.day+'-'+m.month+'-'+m.year+" ";
	var mTime = (m.hour>=12)?m.hour-12+':'+m.min+' PM':m.hour+':'+m.min+' AM';
	var det =function(){
	    if(!m.m.p) return "<span><em>"+m.f+":</em></span> ";
	    if(!m.m.p.hasOwnProperty("pic")) return "<span class='img-span'><em>"+m.m.p.n+":</em></span> ";
	    if(m.m.p.hasOwnProperty("pic")) return "<span><img class='img-span' src="+m.m.p.pic+"</img></span>";
	    return '';
	};
	var msg = helpers.output(m.m.m);
	var tag = m.m.t?m.m.t:'';
	var ms = '<div class="messageBody"><hr style="border-color:#fff"/><p style="text-align:right;"><span><em>'+mDate+mTime+'</em></span></p><span>'+det()+'</span><span>'+msg+'</span> <div> <p><button onclick = "addCommentBox(this)">reply</button></p> </div></div>';
return ms;
    }

};




