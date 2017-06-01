var path = require('path'),
fs = require('fs');


require('http').createServer(function(req, res) {
var file = path.normalize('.' + req.url);
console.log('Trying to serve', file);
function reportError(err) {
console.log(err);
res.writeHead(500);
res.end('Internal Server Error');
}
fs.exists(file, function(exists) {
if (exists) {
fs.stat(file, function(err, stat) {
var rs;
if (err) {
return reportError(err);
}
if (stat.isDirectory()) {
res.writeHead(403); res.end('Forbidden');
} else {
	
	  var filename = path.basename(file);
	  //Download wont happen w/o setting content disposition
	  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
	  res.setHeader('Content-type', 'text/plain');
	  rs = fs.createReadStream(file);
	  rs.on('error', reportError);
	  res.writeHead(200);
	  // res.write("Starting Download");
	  rs.pipe(res,{end:false});
	  rs.on("end",function(){
		  res.end();
	  })
}
});
} else{
res.writeHead(404);
res.end('Not found');
}
});
}).listen(4009);



require('http').createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	var left = 10;
	var interval = setInterval(function() {
	for(var i = 0; i< 100; i++) {
	res.write(Date.now() + " ");
	}
	if (-- left === 0) {
	clearInterval(interval);
	res.end();
	}
	}, 1000);
	}).listen(4010);
