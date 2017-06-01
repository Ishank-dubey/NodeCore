/*TCP Server*/
(function() {
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
		
		socket.write("Welcome BMS chat Room\n");
		socket.on('data', function(data) {
		    socket.write("Received from Client:::"+data);	
		});
		
		socket.on('close', function() {
			console.log('connection closed');
			});
	});

	server.listen(4011);	
})();

/*TCP Client*/
(function connect(){
	var net = require('net');
	var port = 4011;
	var conn = net.createConnection(port);
	
	process.stdin.resume();
	
	//process.stdin.pipe(conn);
	
	process.stdin.on('data',function(data){
		if(data.toString().trim() === 'quit'){
			conn.end();
			process.stdin.end();
		}else{
			conn.write(data);
		}
	})
	
	
	conn.on('connect', function() {
		console.log('connected to server');
		});
	conn.on('error', function(err) {
		console.log('Error in connection:', err);
		});
	
	conn.on('close',function(){
		console.log('Exiting and Reconnecting');
		connect();
	});
	
	conn.pipe(process.stdout, {end: false});//Sends to console
	
	conn.on('data', function(data) {
		console.log('data in connection:', data.toString());
		});
	
	
})();

