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
my_async_function(function() {
console.log('async is done!');
schedule();
});
}, interval);
}());








