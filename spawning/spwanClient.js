/*var aSpwan = require("child_process").spawn;

var aChild = aSpwan('node',['spawning/spwaner.js']);

aChild.stdin.write(123+'\n');
aChild.stdout.once('data', function(data) {
	console.log('child replied to ' + ' with: ' + data);
});
aChild.on('SIGUSR2', function(code) {
	console.log('child process terminated with code ' + code);
});*/

/*process.on('SIGINT', function() {
console.log('Got a SIGUSR2 signal');
});*/
var aSpawn = require('child_process').spawn;

aSpawn('sleep',['60']);
