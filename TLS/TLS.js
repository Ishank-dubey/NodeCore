/*
 * Transport Layer Security
 */
(function(){
	var fs = require("fs");
	var tls = require("tls");

	var server = tls.createServer({
		key:fs.readFileSync('my_key.pem'),
		cert:fs.readFileSync('my_cert.pem'),
		ca: [ fs.readFileSync('my_cert.pem') ]
	});

	server.listen(4001);
	server.on("secureConnection",function(socket){
		console.log('Received Connection');
		socket.write("Secure Hi");
		
		socket.on("data",function(data){
			console.log("Received::",data.toString());
		});
	});
})();

(function(){
	var fs = require("fs");
	var tls = require("tls");

	var server = tls.connect(4001,'localhost',{
		key:fs.readFileSync('my_key.pem'),
		cert:fs.readFileSync('my_cert.pem'),
		ca: [ fs.readFileSync('my_cert.pem') ]
	},function(){
	   console.log('Connected');
	   server.write("From Client");
	});
	
	server.on("data",function(data){
		console.log(data.toString());
	});
})();

