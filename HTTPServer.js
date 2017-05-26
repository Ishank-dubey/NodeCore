var http = require('http');
var util = require('util');
var server = http.createServer();


//var rs = require('fs').createReadStream('my_file.txt');
server.on('request', function(req, res) {
	//rs.pipe(res);
	console.log('new req');
	res.writeHead(200, {'Content-Type': 'text/plain'});
	/*res.write('From Server!'+" "+req.url+" "+req.method+" "+util.inspect(req.headers));
	res.end();*/
	
	//Launch a child process with a "tail -f /var/log/system.log" command
	var spawn = require('child_process').spawn;
	var child = spawn('tail', ['-f', 'my_file_close']);
	
	child.stdout.on('data',function(data){
		res.write(data);
	});
	
	child.stdout.pipe(res);
	
	req.on("end",function(){
		console.log("closong");
		child.kill();
		//server.close();
	});
});
server.listen(4008);

/*var spawn = require('child_process').spawn;
require('http').createServer(function(req, res) {
var child = spawn('tail', ['-f', 'my_file.txt']);
child.stdout.pipe(res);
res.on('end', function() {
child.kill();
});
}).listen(4008);*/