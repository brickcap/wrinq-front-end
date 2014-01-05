var domElements = {

    'signUpForm' :'<form  id ="signUpForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder= "username" onfocusout="checkUser(this)" onfocus = "clearMessages()" required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton"  value="sign up" disabled/></p></form><p id ="message"></p><p><span class ="underline-spans" onclick = "loginClick()">or login<span></p>',

    'loginForm': '<form  method="POST" id="loginForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder="username"  required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" id="submitButton" name="" value="login"/></p></form><p id= "message"></p><p ><span class ="underline-spans" onclick ="signUpClick()">or sign-up<span></p>',

    'commentBox':'<div class="box"><p><textarea rows="5" name="message" placeholder="your message" onkeyup="autoGrow(this)"></textarea></p></div> <span><button type="button" onclick="reply(this)">post</button></span><span><button type="button" onclick="removeCommentBox(this)">cancel</button>',

    'contact' : function(o){
	var temp = '<div class="contacts"><h1 style="text-align:center;">contacts</h1></div>';
	return temp;
    },
    'addContact' : '<div class="center-div"><input type="text" placeholder="username of the contact"/><p><button>send request</button></p></div>',

    'sendMessage' : '<div  class="box"><p><input type="text" name="to" placeholder="@to"/></p><p><textarea rows="5" placeholder="your message" onkeyup="autoGrow(this)" name="message"></textarea></p><p><input type="text" name="tag" placeholder="#tag  (optional)"/></p></div> <span><button type="button" onclick="send(this)">post</button></span>',

    'incomingMessage' : function(m){
	console.log(m);
	var mDate = m.day+'-'+m.month+'-'+m.year+" "+(m.hour>12)?m.hour-12+':'+m.min+' PM':m.hour+':'+m.min+' AM';
	var pic = m.m.p.pic?'<span><img src="'+m.pic+'</img></span>':'<em>'+m.m.p.n+':</em>';
	var msg = m.m.m;
	var tag = m.m.t?m.m.t:'';
	var ms = '<div class="messageBody">'+pic+msg+'<p><span>'+mDate+'</span></p> <div> <p><span class="action-item" title="reply" onclick = "addCommentBox(this)"><\\></span></p> </div> </div>';
return ms;
    }

};




