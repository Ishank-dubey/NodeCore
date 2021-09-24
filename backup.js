const fs = require('fs');
const path = require('path');
const LineByLineReader = require('line-by-line');



const resultsPath = [];
const indexPath = '/root/SDP_BHC/input';
const lrmain = new LineByLineReader('./Credentials.csv');
let totalPaths = 0;
let currentPathIndex = 0;

let lastDayDate = getLD();
lrmain.on('line', function (line) {
	 let anArray = line.split(',');
     let path1 = `${indexPath}/${anArray[0]}/${anArray[1]}/IP_A/${lastDayDate}/PSC-TrafficHandler_8.1_A_1_InternalProviderData.csv`;
     let path2 = `${indexPath}/${anArray[0]}/${anArray[1]}/IP_A/${lastDayDate}/PSC-DCIPDiameter_1.0_A_1_Remote.csv`;
     let path3 = `${indexPath}/${anArray[0]}/${anArray[1]}/IP_A/${lastDayDate}/PSC-DCIPDiameter_1.0_A_1_Anchor.csv`;
	 let path4 = `${indexPath}/${anArray[0]}/${anArray[1]}/IP_B/${lastDayDate}/PSC-DCIPDiameter_1.0_B_1_Remote.csv`;
	 let path5 = `${indexPath}/${anArray[0]}/${anArray[1]}/IP_B/${lastDayDate}/PSC-DCIPDiameter_1.0_B_1_Anchor.csv`;
//console.log(path1, 'path1');	 
try {
     if (fs.existsSync(path1)) {
        resultsPath.push(path1);
     }
      } catch(err) {
  
      }
	  try{
     if (fs.existsSync(path2)) {
        resultsPath.push(path2);
     }
     } catch(err) {
        
     }
	 try{
	 if (fs.existsSync(path3)) {
        resultsPath.push(path3);
     }
     } catch(err) {
        
     }
	 try{
	 if (fs.existsSync(path4)) {
        resultsPath.push(path4);
     }
     } catch(err) {
        
     }
	 try{
	 if (fs.existsSync(path5)) {
        resultsPath.push(path5);
     }
     } catch(err) {
        
     }
});
lrmain.on('end', function (line) {
     console.log(resultsPath,'test');
	 totalPaths = resultsPath.length;
     currentPathIndex = 0;
     createFile();
});

function createFile() {

     if(currentPathIndex == totalPaths){
		console.log("Wrote all the files present");
		return 0;
	}

    let currentPath = resultsPath[currentPathIndex];
     if(currentPath.match("_Anchor")){
              createFileAnchor();
     }
     else if(currentPath.match("_InternalProviderData")){
              createFileInternalProvider();
     }
     else if(currentPath.match("_Remote")){
              createFileRemote();
     }
}


function createFileInternalProvider() {
	const lr = new LineByLineReader(resultsPath[currentPathIndex]);
	const dataMap = {};
	
	let dateFound = false;
	let yesterday = getLastDay();
	let currentHour = '';
	const categories = ["Local Provider Get", "Local Provider Update"];
	lr.on('error', function (err) {
		
	});

	lr.on('line', function (line) {
		
		if(line.includes('Name')) {
		  	if(line.includes(yesterday)){
		  		dateFound = true;
		  	} else {
		  		dateFound = false;
		  	}
		} else {
			if(dateFound && !line.includes("Name") && !line.includes('Avg') && (line.includes(categories[0]) || line.includes(categories[1]))) {
				let lineParse = line.split(' ').filter(n => n);
				
				if(lineParse.length == 11) {
					currentHour = lineParse[0].substr(0,2);
					lineParse.shift();
					if(! dataMap[currentHour]){
						dataMap[currentHour]= {};
					}
				}
				let categoryLocal = `${lineParse.shift()} ${lineParse.shift()} ${lineParse.shift()}`;
				
				if(! dataMap[currentHour][categoryLocal]) {
					dataMap[currentHour][categoryLocal] = Array(7).fill(0);
				}
				
				for(let i=0;i < 7;i++){
					if(! isNaN(lineParse[i])){
						dataMap[currentHour][categoryLocal][i] =  parseFloat(dataMap[currentHour][categoryLocal][i])+ parseFloat(lineParse[i]);
					}
				}
			}
		}
	});

	lr.on('end', function () {
		console.log('END---->>>>>');
		
		const createCsvWriter = require('csv-writer').createObjectCsvWriter;
              let { dir, name } = path.parse(resultsPath[currentPathIndex]);
              let currentFileName = path.resolve(dir, `${name}_${yesterday}.csv`);
		const csvWriter = createCsvWriter({
		    path: currentFileName,
		    header: [
		    	{id:'hour', title: 'Hour'},
		    	{id:'category', title: 'Category'},
		    	{id:'succ', title: 'Succ'}, 
		    	{id:'fail', title: 'Fail'}, 
		    	{id:'reject', title: 'Reject'}, 
		    	{id:'thrput', title:'Throughput(/s)'}, 
		    	{id:'avg', title:'Response time(ms) Avg'}, 
		    	{id:'min', title:'Response time(ms) Min'}, 
		    	{id:'max', title:'Response time(ms) Max'}
		    ]
		});
		const rows = [];
		const hoursParsed = Object.keys(dataMap);
		hoursParsed.sort((a, b)=> parseInt(a) - parseInt(b));
		hoursParsed.forEach((arg) => {
			categories.forEach((category) => {
                            if(dataMap[arg] && dataMap[arg][category])
				rows.push({
					hour: `${arg[0]}${arg[1]}`, 
					category, 
					succ: dataMap[arg][category][0],
					fail: dataMap[arg][category][1],				
					reject: dataMap[arg][category][2],
					thrput: dataMap[arg][category][3],
					avg: dataMap[arg][category][4],
					min: dataMap[arg][category][5],
					max: dataMap[arg][category][6],
				});	
			});
		});
		csvWriter.writeRecords(rows)
	    .then(() => {
	        console.log('Internal provider Data CSV is created');
               currentPathIndex++;
		 createFile();
	    });
	});
}
//createFileInternalProvider();

function createFileAnchor() {
	const lr = new LineByLineReader(resultsPath[currentPathIndex]);
	const dataMap = {};
	const category = "DCIPDiameter";
	let dateFound = false;
	let yesterday = getLastDay();
	let currentHour = '';
	
	lr.on('error', function (err) {
		
	});

	lr.on('line', function (line) {
		if(line.includes('Name')) {
		  	if(line.includes(yesterday)){
		  		dateFound = true;
		  	} else {
		  		dateFound = false;
		  	}
		} else {
			if(dateFound && !line.includes("Name") && !line.includes('Avg') && line.includes(category)) {
				let lineParse = line.split(' ').filter(n => n);
				
				currentHour = lineParse[0].substr(0,2);
				lineParse.shift();
				if(! dataMap[currentHour]){
					dataMap[currentHour]= {};
				}
				
				let categoryLocal = lineParse[0];
				
				if(! dataMap[currentHour][categoryLocal]) {
					dataMap[currentHour][categoryLocal] = Array(7).fill(0);
				}
				lineParse.shift();
				for(let i=0;i < 7;i++){
					if(! isNaN(lineParse[i])){
						dataMap[currentHour][categoryLocal][i] =  parseFloat(dataMap[currentHour][categoryLocal][i])+ parseFloat(lineParse[i]);
					}
				}
			}
		}
	});
	
	lr.on('end', function () {
		console.log('END---->>>>>');
		//console.log(dataMap);
		
		
		
		const createCsvWriter = require('csv-writer').createObjectCsvWriter;
              let { dir, name } = path.parse(resultsPath[currentPathIndex]);
              let currentFileName = path.resolve(dir, `${name}_${yesterday}.csv`);
		const csvWriter = createCsvWriter({
		    path: currentFileName,
		    header: [
		    	{id:'hour', title: 'Hour'},
		    	{id:'category', title: 'Category'},
		    	{id:'succ', title: 'Succ'}, 
		    	{id:'fail', title: 'Fail'}, 
		    	{id:'reject', title: 'Reject'}, 
		    	{id:'thrput', title:'Throughput(/s)'}, 
		    	{id:'avg', title:'Response time(ms) Avg'}, 
		    	{id:'min', title:'Response time(ms) Min'}, 
		    	{id:'max', title:'Response time(ms) Max'}
		    ]
		});
		const rows = [];
		const hoursParsed = Object.keys(dataMap);
		hoursParsed.sort((a, b)=> parseInt(a) - parseInt(b));
		
		hoursParsed.forEach((arg) => {
			if(dataMap[arg] && dataMap[arg][category])
				rows.push({
					hour: `${arg[0]}${arg[1]}`, 
					category, 
					succ: dataMap[arg][category][0],
					fail: dataMap[arg][category][1],
					reject: dataMap[arg][category][2],
					thrput: dataMap[arg][category][3],
					avg: dataMap[arg][category][4],
					min: dataMap[arg][category][5],
					max: dataMap[arg][category][6],
				});	
			
		});
		csvWriter.writeRecords(rows)
	    .then(() => {
	        console.log('Anchor CSV is created');
               currentPathIndex++;
		 createFile();
	    });
	});
}


function createFileRemote() {
	
const lr = new LineByLineReader(resultsPath[currentPathIndex]);
const dataMap = {};
let count = 0;
let dateFound = false;
let yesterday = getLastDay();
let currentHour = '';
lr.on('error', function (err) {
	
});

lr.on('line', function (line) {
	count ++;
	if(line.includes('Name')) {
	   	if(line.includes(yesterday)){
	   		dateFound = true;
	   	} else {
	   		dateFound = false;
	   	}
	} else {
		if(dateFound && !line.includes("Name") && !line.includes('Answered') && !line.includes('(/s)')) {
			let lineParse = line.split(' ').filter(n => n);
			if(lineParse.length == 12) {
				currentHour = lineParse[0].substr(0,2);
				lineParse.shift();
				if(! dataMap[currentHour]){
					dataMap[currentHour]= {};
				}
			}
			let categoryLocal = lineParse[0];
			
			if(dataMap[currentHour] && ! dataMap[currentHour][categoryLocal]) {
				dataMap[currentHour][categoryLocal] = Array(10).fill(0);
			}
			lineParse.shift();
			for(let i=0;i < 10;i++){
				if(! isNaN(lineParse[i])){
					dataMap[currentHour][categoryLocal][i] =  parseFloat(dataMap[currentHour][categoryLocal][i])+ parseFloat(lineParse[i]);
				}
			}
		}
	}
});

lr.on('end', function () {
	//console.log('END---->>>>>');
	
	const createCsvWriter = require('csv-writer').createObjectCsvWriter;
	let { dir, name } = path.parse(resultsPath[currentPathIndex]);
	let currentFileName = path.resolve(dir, `${name}_${yesterday}.csv`);
	const csvWriter = createCsvWriter({
	    path: currentFileName,
	    header: [
	    	{id:'hour', title: 'Hour'},
	    	{id:'category', title: 'Category'},
	    	{id:'succ', title: 'Succ'}, 
	    	{id:'fail', title: 'Fail'}, 
	    	{id:'timeout', title: 'Timeout'}, 
	    	{id:'reject', title: 'Reject'}, 
	    	{id:'retransmissiondetected', title:'Retransmission Detected'}, 
	    	{id:'duplicateanswered', title:'Duplicate Answered'}, 
	    	{id:'thrput', title:'Throughput(/s)'}, 
	    	{id:'avg', title:'Response time(ms) Avg'}, 
	    	{id:'min', title:'Response time(ms) Min'}, 
	    	{id:'max', title:'Response time(ms) Max'}
	    ]
	});
	const rows = [];
	const hoursParsed = Object.keys(dataMap);
       const categories = ["DCIPDiameter", "ProviderGet", "ProviderUpdate", "ProviderCleanup"];
	hoursParsed.sort((a, b)=> parseInt(a) - parseInt(b));
	
	hoursParsed.forEach((arg) => {
		categories.forEach((category) => {
                     if(dataMap[arg] && dataMap[arg][category])
			rows.push({
				hour: `${arg[0]}${arg[1]}`, 
				category, 
				succ: dataMap[arg][category][0],
				fail: dataMap[arg][category][1],
				timeout: dataMap[arg][category][2],
				reject: dataMap[arg][category][3],
				retransmissiondetected: dataMap[arg][category][4],
				duplicateanswered: dataMap[arg][category][5],
				thrput: dataMap[arg][category][6],
				avg: dataMap[arg][category][7],
				min: dataMap[arg][category][8],
				max: dataMap[arg][category][9],
			});	
		});
	});
	csvWriter.writeRecords(rows)
    .then(() => {
        console.log('Remote CSV is created');
		currentPathIndex++;
		createFile();
    });
});
}



/*const readableStream = fs.createReadStream('/Users/rajneeshdubey/Downloads/SDP_BHCA/PSC-DCIPDiameter_1.0_A_1_Remote.stat.1');

readableStream.on('data', (chunk) => {
	console.log(chunk instanceof Buffer);
})*/


function getLastDay() {
	let yesterday = new Date(Date.now() - 86400000);
	let year = yesterday.getFullYear()% 100;
	let month = yesterday.getMonth() +  1;
	if(month < 10) {
		month = `0${month}`;
	}
	let date = yesterday.getDate();
        return '21-09-23';
	//return `${year}-${month}-${date}`;
}
function getLD() {
	let yesterday = new Date(Date.now() - 86400000);
	let year = yesterday.getFullYear();
	let month = yesterday.getMonth() +  1;
	if(month < 10) {
		month = `0${month}`;
	}
	let date = yesterday.getDate();
       return '20210923';
	//return `${year}${month}${date}`;
}
