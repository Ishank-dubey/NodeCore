var net = require('net');

var server = net.createServer();

var sockets = [];

server.on('error', function(err) {
console.log('Server error:', err.message);
});

server.on('close', function() {
console.log('Server closed');
});


server.on('connection', function(socket) {
	console.log('got a new connection');
	sockets.push(socket);
	socket.on('data', function(data) {
		sockets.forEach(function(otherSocket) {
			if (otherSocket !== socket) {
			otherSocket.write(data);
			}
			});
	});
	
	socket.on('close', function() {
		console.log('connection closed');
		var index = sockets.indexOf(socket);
		sockets.splice(index, 1);
		});
});

server.listen(4007);