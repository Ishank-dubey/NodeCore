(function(){
	var server = require('http').createServer(function(request, response){
		request.on("end",function(da){
			console.log("END:::"+request.method);
		});
		
		request.on("data",function(da){
			console.log("DATA:::");
		});
		response.writeHead(200,{'Content-Type': 'text/plain'})
		response.write('From HTTP Server');
		response.end();
	});
	server.listen(4012);
})();


(function(){
	var http = require('http');
	var options = {
	port: 4012,
	method: "POST"
	};
	var file = require('fs').createWriteStream('ServerResp.txt');
	//request.on('response', responseHandler);
	var request = http.request(options, function(response){
		response.pipe(file);
		response.on("data",function(data){
		//console.log(data);
			var aBuffer = new Buffer(data.toString());
			process.stdout.write(data);//process.stdout.write(aBuffer)
		});
		
	});
	request.end();
})();


(function(){
	require('http').createServer(function(request, response){
		request.on('data',function(da){
			console.log("DATA::::::T "+da);
		});
		function printCb(){
			response.writeHead(200,{'Content-Type': 'text/plain'});
			response.end(JSON.stringify({
				url: request.url,
				method:request.method,
				headers:request.headers,
				data:"tets"
			}));
		}
		switch (request.url){
		case '/redirect':
			response.writeHead(301, {"Location":'/'});
			response.end(JSON.stringify({data:"sss"}));
			break;
			
		case '/print/body':
			requset.setEncoding('utf8');
			var body='';
			request.on('data',function(d){
				body = body+" "+d;
			});
			request.on("end",function(){
				response.end(JSON.stringify(body));
			});
			break;	
		default:
			printCb();
			break;
		}
	}).listen(4013);
})();

(function(){
	var request = require('request');
	var inspect = require('util').inspect;
	request({url:"http://localhost:4013/redirect", headers:{'x-head':"troy"}},function(err, res, body) {
	if (err) { throw err; }
	console.log("-------GET-------");
	console.log(inspect({
	statusCode: res.statusCode, body:JSON.parse(body)
	}));
	}
	);
})();


(function(){
	var request = require('request');
	var inspect = require('util').inspect;
	request.post({url:"http://localhost:4012",body:'tuhTuh'},function(err, res, body) {
	if (err) { throw err; }
	console.log("-------POST-------");
	console.log(inspect({
	statusCode: res.statusCode, body:body
	}));
	}
	);
})();


(function(){
	var request = require('request');
	var inspect = require('util').inspect;
	request.put({url:"http://localhost:4013/abc/def",
		headers:{
	
		"x-head":'hector'
		
	},
	body:"Test"
	},function(err, res, body) {
	if (err) { throw err; }
	console.log("-------PUT-------");
	console.log(inspect({
	statusCode: res.statusCode, body:JSON.parse(body)
	}));
	}
	);
})();