//process.stdin.resume();

process.stdin.on('data',function(data){
	// parse the input data into a number
	number = parseInt(data.toString(), 10);
	++number;
	process.stdout.write(number + "\n");
	//process.kill('SIGUSR2');
})