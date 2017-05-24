/*Buffers*/
var aModule = require('./myFolder1/api1');

aModule();

var buf = new Buffer('Aaaa');//Buffer from UTF-8-encoded string

console.log(buf.length+" "+buf.toString());//8 bits in a buffer location
										   //.toString() can decode


var buffer1 = new Buffer("this is the content of my buffer");
var buffer2 = new Buffer(11);
var targetStart = 0;
var sourceStart = 8;
var sourceEnd = 19;
buffer1.copy(buffer2, targetStart, sourceStart, sourceEnd);
console.log(buffer2.toString()); // -> "the content"


var utf8String = 'my string';
var buf = new Buffer(utf8String);
var base64String = buf.toString('base64');//Transcode utf-8 to Base 64

Object.create({name:base64String}); // Okay that

/*Event Emmiters*/
var aEventM = require('./myFolder1/events');
//aEventM.prototype.tick = 


aEventM = new aEventM();
aEventM.on("error",function(err){console.log('err');});
aEventM.anEmitterFunction();


/*Scheduling using setTimeout and clearTimeout*/
var timeoutTime = 1000; // one second
var timeout = setTimeout(function() {
console.log("timed out!");
}, timeoutTime);
clearTimeout(timeout);
// When all the events in the Queue have been processed
process.nextTick(function() {
	console.log("process loop end");
	});
// Pattern to make sure that the async function only when the previous one is complete
var interval = 1000; // 1 second
(function schedule() {
setTimeout(function do_it() {
/*my_async_function(function() {
console.log('async is done!');
schedule();
});*/
}, interval);
}());



/*File Manipulations*/

// Path Normalization
var path = require('path');
var aPath = path.normalize('/foo/bar//baz/asdf/quux/..');
console.log(aPath);
// => '/foo/bar/baz/asdf'

/*Join Paths*/
var aJoinedPath = path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');

//Resolve
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// => ../../impl/bbb

//Relative path between to absolute paths
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// => ../../impl/bbb


//Extracting components of a path
// Having the parent dir path
path.dirname('/foo/bar/baz/asdf/quux.txt');
// => /foo/bar/baz/asdf


//Finding file name
path.basename('/foo/bar/baz/asdf/quux.html')
//=> quux.html
path.extname('/a/b/index.html');


var fs = require('fs');
fs.stat('./README.md', function(err, stats) {
if (err) { throw err;}
console.log(stats.isFile());//isDirectory()
});

/*Open and Read a file*/

fs.open('./README.md','r',function open(errO,fd){
	var aBuffer = new Buffer(1024),
	position = 0,
	offSet =0,
	bLength = aBuffer.length;
	 fs.read(fd,aBuffer, offSet, bLength, position, function read(errR, readBytes){
		 console.log(aBuffer[1].toString());
	 })
	
});

fs.open('./my_file.txt', 'a', function opened(err, fd) {
if (err) { throw err; }
var writeBuffer = new Buffer('writing this string 12345678'),
bufferPosition = 1,
bufferLength = writeBuffer.length-1, 
filePosition = null;//Writes happen at current cursor position i.e. end of file
fs.write( fd,
writeBuffer,
bufferPosition,
bufferLength,
filePosition,
function wrote(err, written) {
if (err) { throw err; }
console.log('wrote ' + written + ' bytes');
});
});

//open and close

function openAndWriteToSystemLog(writeBuffer, callback) {
fs.open('./my_file_close', 'a', function opened(err, fd) {
if (err) { return callback(err); }
function notifyError(err) {
fs.close(fd, function() {
callback(err);
});
}
var bufferOffset = 0,
bufferLength = writeBuffer.length,
filePosition = null;
fs.write( fd, writeBuffer, bufferOffset, bufferLength, filePosition,
function wrote(err, written) {
if (err) { return notifyError(err); }
fs.close(fd, function() {
callback(err);
});
}
);
});
}
openAndWriteToSystemLog(
new Buffer('writing this string'),
function done(err) {
if (err) {
console.log("error while opening and writing:", err.message);
return;
}
console.log('All done with no errors');
}
);

//Executing External commands

var extComd = require('child_process').exec;
extComd('ls',function(err,out,stdErr){
	//console.log(err);
	//console.log(out);
	//console.log(stdErr);
});

//External commands with options
var env = process.env,
myEnv = {};
for(var akey in env){
	myEnv[akey] = 	env[akey];
}

extComd('ls -la',{env:myEnv},function(err,out,stdErr){
	
});


var aParent = require('./myFolder1/parent')();



//Receiving Data from Child- Spawning
//Data that comes via an Exec is Buffered and can not be Streamed so Spawning
var spawn = require('child_process').spawn;
//Launch a child process with a "tail -f /var/log/system.log" command
var child = spawn('tail', ['-f', 'my_file.txt']);
child.stdout.on('data', function(data) {
	console.log('tail output: ' + data);
});

//Send the data to Child process

//Launch a child process with a "tail -f /var/log/system.log" command
var child = spawn('node', ['spawning/spwanClient.js']);
child.stdout.on('data', function(data) {
	console.log('Two Way o/p: ' + data);
});
/*process.on('SIGINT', function() {
	console.log('Got a SIGUSR2 signal');
	});*/


child.on('exit', function(code, data) {
	console.log('EXIT '+data+" "+code);
	});
process.on('SIGINT',function(err){
	console.log(err+' '+'SIGINT..Exiting....');
	process.exit();
})
child.kill('SIGINT');

var aChild2 = spawn('node',['-v']);
aChild2.stdout.on('data',function(data){
	console.log("\n the node version is:",data.toString());
});
/*child.on('SIGUSR1', function(code) {
	console.log('child process terminated with code ' + code);
});*/

//child.kill('message') be sent




/*STREAMS*/
var fs2 = require('fs');
var path = 'my_file.txt'
var readStream = fs2 .createReadStream(path, {start: 10});
readStream.on('data',function(da){
	console.log(da.toString());
});
readStream.on('end',function(){
	console.log('DRAINED')
	process.exit();
});//Note that its being done w/o a buffer


/*Slow Client Problem*/

