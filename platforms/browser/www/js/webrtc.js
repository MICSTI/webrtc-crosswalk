$(document).ready(function() {
	// log
	var $log = $(".users");
	
	// user
	var user = new User();
	user.name = "Crosswalk";
	
	// server "user"
	var server = new User();
	server.id = 1;
	server.name = "Server";
	
	// try to connect to websocket server
	var connection = new WebSocket('wss://10.0.0.4:1337');
	
	connection.onopen = function() {
	   $log.append("<li>WebSocket connection opened</li>");
	   
	   // send user info
		var message = new Message();
		   
		message.topic = message.topics.USER_INFO;
		message.sender = user;
		message.recipient = server;
		message.content = user;
		message.type = message.types.SERVER;

		connection.send(JSON.stringify(message));
		
		// try to get camera access
		var mediaConstraints = {
			audio: false,
			video: true
		};
		
		var successCallback = function() {
			$log.append("<li>Got user media</li>");
			
			user.gotUserMedia = true;
			
			var message = new Message();
		   
			message.topic = message.topics.USER_INFO;
			message.sender = user;
			message.recipient = server;
			message.content = user;
			message.type = message.types.SERVER;

			connection.send(JSON.stringify(message));
		};
		
		var failedCallback = function() {
			$log.append("<li>Did not get user media</li>");
		};
		
		navigator.webkitGetUserMedia(mediaConstraints, successCallback, failedCallback);
	};

	connection.onerror = function(error) {
		$log.append("<li>WebSocket connection failed</li>");
	};

	// most important part - incoming messages
	connection.onmessage = function(message) {
		console.log("Message received", message);
		
		// message origin
		var origin = message.origin;
		
		// parse message JSON data
		var messageData = JSON.parse(message.data);
		
		$log.append("<li>Message received: " + JSON.stringify(messageData) + "</li>");
	};
});