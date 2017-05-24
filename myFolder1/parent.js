function start(){
var exec = require('child_process').exec;
exec('node myFolder1/child', {env: {number: 123}}, function(err, stdout, stderr) {
if (err) { throw err; }
console.log('stdout'+stdout);
});
}

module.exports = start;