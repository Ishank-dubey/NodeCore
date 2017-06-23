(function(){
	var fs = require('fs'); 
	var https = require('https'); 
	var options = { 
	    key: fs.readFileSync('server-key.pem'), 
	    cert: fs.readFileSync('server-crt.pem'), 
	    ca: fs.readFileSync('ca-crt.pem')/*, 
	    requestCert: true, 
	    rejectUnauthorized: true*/
	}; 
	https.createServer(options, function (req, res) { 
	    console.log(new Date()+' '+ 
	        req.connection.remoteAddress+' '+ 
	        req.method+' '+req.url); 
	    res.writeHead(200); 
	    res.end("hello world with CA \n"); 
	}).listen(4433);
})();

(function(){
	var fs = require('fs'); 
	var https = require('https'); 
	var options = { 
	    hostname: 'localhost', 
	    port: 4433, 
	    path: '/', 
	    method: 'GET', 
	    key: fs.readFileSync('client1-key.pem'), 
	    cert: fs.readFileSync('client1-crt.pem'), 
	    ca: fs.readFileSync('ca-crt.pem') 
	}; 
	var req = https.request(options, function(res) { 
	    res.on('data', function(data) { 
	        process.stdout.write(data); 
	    }); 
	}); 
	req.end();
})();
