var server = require('net').createServer();
var port = 4001;
server.on('listening', function() {
console.log('Server is listening on port', port);
});
server.on('connection', function(socket) {
console.log('Server has a new connection');

socket.setEncoding('utf8');
socket.write("Hello! You can start typing. Type 'quit' to exit.\n");


socket.on('data',function(data){
	console.log('got:', data.toString());
	if(data.trim()==='quit'){
		socket.write('Bye bye!');
		return socket.end();
	}
	socket.write(data);
});

socket.on('end',function(){
	console.log('close client connection');
});


});

server.on('close', function() {
console.log('Server is now closed');
});

server.on('error', function(err) {
console.log('Error occurred:', err.message);
});

server.listen(port);


require('net').createServer(function(socket) {
	var ws = require('fs').createWriteStream('serverCreated.txt');
	socket.pipe(ws);
	}).listen(4002);


require('net').createServer(function(socket) {
	var rs = require('fs').createReadStream('serverCreated.txt');
	rs.pipe(socket,{end:false});
	}).listen(4003);


