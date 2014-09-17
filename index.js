var connect = require('connect');
var http = require('http');
var login = require('./login');
var util = require('util');
var bodyParser  = require('body-parser');
var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`

app.use('/', main);

function main(request, response, next) {
	switch (request.method) {
		case 'GET': get(request, response); break;
		case 'POST': post(request, response); break;
		case 'DELETE': del(request, response); break;
		case 'PUT': put(request, response); break;
	}
};

function get(request, response) {
	var cookies = request.cookies;
	console.log(cookies);
	if ('session_id' in cookies) {
		var sid = cookies['session_id'];
		if ( login.isLoggedIn(sid) ) {
			response.setHeader('Set-Cookie', 'session_id=' + sid);
			response.end(login.hello(sid));	
		} else {
			response.end("Invalid session_id! Please login again\n");
		}
	} else {
		response.end("Please login via HTTP POST\n");
	}
};

function post(request, response) {
 var email =request.body.email;

 var name =request.body.name;
  
console.log(email);
console.log(name);
// var newSessionId = login.login('xxx', 'xxx@gmail.com');
var newSessionId = login.login(name, email);
	// TODO: set new session id to the 'session_id' cookie in the response
	
 response.setHeader('Set-Cookie',newSessionId);
	// replace "Logged In" response with response.end(login.hello(newSessionId));
 response.writeHead(200, "OK",{'Content-Type':'text/html'});
var sessionID = login.hello(newSessionId);
	response.end(sessionID);
	
}
function del(request, response) {
	console.log("DELETE:: Logout from the server");
 	// TODO: remove session id via login.logout(xxx)
 	var cookies = request.cookies;
		if ('session_id' in cookies) {
		var sid = cookies['session_id'];
 	var del = login.logout(sid);
 	// No need to set session id in the response cookies since you just logged out!

  	response.end('Logged out from the server\n');
  }
};

function put(request, response) {
	console.log("PUT:: Re-generate new seesion_id for the same user");

	// TODO: refresh session id; similar to the post() function
	var cookies = request.cookies;
		if ('session_id' in cookies) {
		var sid = cookies['session_id'];
		//use login.refresh to create a new session id and replacing the excisting session id
		var sid1= login.refresh(sid);
			 response.setHeader('Set-Cookie',sid1);
             response.writeHead(200, "OK",{'Content-Type':'text/html'});
			
	} else {
		response.end("Enter SessionID");
	}
		response.end("Re-freshed session id\n");
};




app.listen(8000,'127.0.0.1');

console.log("Node.JS server running at 8000...");
