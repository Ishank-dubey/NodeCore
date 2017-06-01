(function(){
	var socket = require("dgram").createSocket('udp4');
	var port = 4020;
	socket.on('message',function(message, rinfo){
		//console.log(message);
		socket.send(message,0,message.length,rinfo.port,rinfo.address);
	});

	socket.on('listening',function(){
		socket.send("tets",0,4,4021,'localhost');
		//socket.close();
	});

	socket.bind(port);
})();


(function(){
	var socket = require("dgram").createSocket('udp4');
	var port = 4021;
	socket.on('message',function(message, rinfo){
		//console.log(message.toString());
	});

	socket.on('listening',function(){
		
		//console.log("listening")
	});

	socket.bind(port);
})();

(function(){
	var dgram = require('dgram');
	var host = "localhost";
	var port = 4019;
	var client = dgram.createSocket('udp4');
	process.stdin.resume();
	process.stdin.on('data', function(data) {
	client.send(data, 0, data.length, 4022, "localhost");
	});
	client.on('message', function(message) {
	console.log('Got message back:', message.toString());
	});
	client.bind(port);
	console.log('Start typing to send messages to %s:%s', host, port);
})();

(function(){
	var server = require('dgram').createSocket('udp4');
	server.on('message', function(message, rinfo) {
	console.log('server got message: ' + message + ' from ' + rinfo.address +
	':' + rinfo.port);
	});
	server.bind(4022);
	//server.addMembership('230.1.2.3');
})();
