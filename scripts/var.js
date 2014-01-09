var signUp= helpers.id("signup");
var login= helpers.id("login");
var splashDiv = helpers.id("splash");
var formDiv = helpers.id("formDiv");
var app = helpers.id("app");
var appBody = helpers.id("appBody");
var appMessage = helpers.id("appMessage");
var messages = helpers.id("messages");
var sendMessage = helpers.id("sendMessage");
var sendBtn = helpers.id("sendBtn");
var btnReply = helpers.id("btnReply");
var messageDiv = helpers.id("messageDiv");
var conversation = helpers.id("conversation");
var openRequest = indexedDB.open("wrinq", 1);
var prf;
var database;
var socket;

