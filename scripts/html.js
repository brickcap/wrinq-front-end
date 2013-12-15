var domElements = {

    'signUpForm' :'<form  id ="signUpForm" onsubmit="submitAjax(event,this)"><p><input type="text" name="username" value="" placeholder= "username" required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="email" name="email" value="" placeholder="email"/></p><p><input type="submit"  value="sign up"/></p></form><p><span class ="underline-spans" onclick = "loginClick()">or login<span></p>',

    'loginForm': '<form  method="POST" id="loginForm"><p><input type="text" name="username" value="" placeholder="username"  required/></p><p><input type="password" name="password" value="" placeholder="password"  required/></p><p><input type="submit" name="" value="login"/></p></form><p ><span class ="underline-spans" onclick ="signUpClick()">or sign-up<span></p>'

};




