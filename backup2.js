const fs = require('fs');
const path = require('path');
const LineByLineReader = require('line-by-line');
const csv=require('csvtojson');



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
function findMaxSingle(array=[]){

    let max = -Infinity; 
    array.forEach((arg)=>{
      if(max < arg.Succ) {
         max = arg.Succ;
      }
    });
     return max;
};
function findMaxFromArraysOfObj(array1 =[], array2=[]){
    let max = -Infinity;
    let keys= ['00','01','02','03','04','05','06','07','08','09','10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    keys.forEach((arg)=>{
         let a= array1.filter((anObj)=> anObj.Hour == arg)[0];
         let b= array2.filter((anObj)=> anObj.Hour == arg)[0];
         if(a && b){
             if(max < a.Succ+b.Succ){
               max = a.Succ+b.Succ;
             }
         } else if(a){
            if(max < a.Succ){
                 max = a.Succ;
            }
         } else if(b){
            if(max < b.Succ) {
                   max = b.Succ;
             }   
         }
    });
     return max;
};
function findMaxFromRemoteArray(array = []){
    let max = -Infinity;
     array.forEach((arg) => {
          if(arg.Category == 'DCIPDiameter') {
                 if(max < arg.Succ) {
                     max = arg.Succ;
                  }
             }
     });
return max;
}
function findMaxFromRemoteArrays(array1 = [], array2 = []){
    let max = -Infinity;
    let keys= ['00','01','02','03','04','05','06','07','08','09','10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    keys.forEach((arg)=>{
         let a= array1.filter((anObj)=> anObj.Hour == arg)[0];
         let b= array2.filter((anObj)=> anObj.Hour == arg)[0];
         if(a && b && a.Category=='DCIPDiameter' && b.Category =='DCIPDiameter'){
             if(max < a.Succ+b.Succ){
               max = a.Succ+b.Succ;
             }
         } else if(a && a.Category=='DCIPDiameter'){
            if(max < a.Succ){
                 max = a.Succ;
            }
         } else if(b && b.Category=='DCIPDiameter'){
            if(max < b.Succ) {
                   max = b.Succ;
             }   
         }
    });
     return max;

}
let maxFound = [];
let all = [];
function getObjFromAll(nodeName, nodeId) {
     let obj = null;
      all.forEach((arg)=>{
         if(arg.nodeName == nodeName && arg.nodeId == nodeId){
                obj=arg;
          }
      });
       return obj;
}
function async getMaxPerNode(){
      if(currentPathIndex == totalPaths){
		console.log("Wrote Singleton csv file with Max values for yesterday");
             
		return 0;
	}
     let currentPath = resultsPath[currentPathIndex];
     let yesterday = getLastDay();

     if(currentPath.match("_Anchor") && !maxFound.includes(currentPath) ){
              let pathA, pathB;
               if(currentPath.match("PSC-DCIPDiameter_1.0_A_1_Anchor")){
                  pathA = currentPath;
                  pathB = currentPath.replace("PSC-DCIPDiameter_1.0_A_1_Anchor","PSC-DCIPDiameter_1.0_B_1_Anchor");   
               } else {
                  pathB = currentPath;
                  pathA = currentPath.replace("PSC-DCIPDiameter_1.0_B_1_Anchor","PSC-DCIPDiameter_1.0_A_1_Anchor");
               }
              let pathAYesterday = `${path.parse(pathA).dir}/${path.parse(pathA).name}_${yesterday}.csv`;
              let pathBYesterday = `${path.parse(pathB).dir}/${path.parse(pathB).name}_${yesterday}.csv`;
              let ipAJson = null;
              let ipBJson = null;
              try{
	         if (fs.existsSync(pathAYesterday)) {
                  ipAJson = await csv().fromFile(pathAYesterday);
                   }
              } catch(err) {
        
               }

               try{
	         if (fs.existsSync(pathBYesterday)) {
                  ipBJson = await csv().fromFile(pathBYesterday);
                   }
              } catch(err) {
        
               }
               let maxVal;
               let nodeName, nodeId;
               if(ipAJson && ipAJson.length && ipAJson[0].Succ != undefined && ipBJson && ipBJson.length && ipBJson.Succ!= undefined){
                   maxVal = findMaxFromArraysOfObj(ipAJson, ipBJson);
                   nodeName = currentPath.split('/')[1];
                   nodeId = currentPath.split('/')[2];
                   let obj = getObjFromAll(nodeName, nodeId) || {};
                   obj.nodeName = nodeName;
                   obj.nodeId = nodeId;
                   obj.Anchor = maxVal; 
                   all.push(obj);
                } else if(ipAJson && ipAJson.length && ipAJson[0].Succ != undefined) {
                    maxVal = findMaxSingle(ipAJson);
                   nodeName = currentPath.split('/')[1];
                   nodeId = currentPath.split('/')[2];let obj = getObjFromAll(nodeName, nodeId) || {};
                   obj.nodeName = nodeName;
                   obj.nodeId = nodeId;
                   obj.Anchor = maxVal; 
                   all.push(obj);
                 } else if(ipBJson && ipBJson.length && ipBJson.Succ!= undefined) {
                    maxVal = findMaxSingle(ipBJson);
                   nodeName = currentPath.split('/')[1];
                   nodeId = currentPath.split('/')[2];
                   let obj = getObjFromAll(nodeName, nodeId) || {};
                   obj.nodeName = nodeName;
                   obj.nodeId = nodeId;
                   obj.Anchor = maxVal; 
                   all.push(obj);
                 }
              
              maxFound.push(pathA);
              maxFound.push(pathB);
     }
     else if(currentPath.match("_InternalProviderData") && !maxFound.includes(currentPath)){
              let pathIPDYesterday = `${path.parse(currentPath).dir}/${path.parse(currentPath).name}_${yesterday}.csv`;
              let ipdJson = null;
              try{
	         if (fs.existsSync(pathIPDYesterday)) {
                  ipdJson = await csv().fromFile(pathIPDYesterday);
                   }
              } catch(err) {
        
               }
                   let maxVal = findMaxFromArraysOfObj(ipdJson);
                   let nodeName = currentPath.split('/')[1];
                   let nodeId = currentPath.split('/')[2];
                   let obj = getObjFromAll(nodeName, nodeId) || {};
                   obj.nodeName = nodeName;
                   obj.nodeId = nodeId;
                   obj.Internal = maxVal; 
                   all.push(obj);
                   maxFound.push(currentPath);
       
     }
     else if(currentPath.match("_Remote") && !maxFound.includes(currentPath)){
             let pathA, pathB;
               if(currentPath.match("PSC-DCIPDiameter_1.0_A_1_Remote")){
                  pathA = currentPath;
                  pathB = currentPath.replace("PSC-DCIPDiameter_1.0_A_1_Remote","PSC-DCIPDiameter_1.0_B_1_Remote");   
               } else {
                  pathB = currentPath;
                  pathA = currentPath.replace("PSC-DCIPDiameter_1.0_B_1_Remote","PSC-DCIPDiameter_1.0_A_1_Remote");
               }
              let pathAYesterday = `${path.parse(pathA).dir}/${path.parse(pathA).name}_${yesterday}.csv`;
              let pathBYesterday = `${path.parse(pathB).dir}/${path.parse(pathB).name}_${yesterday}.csv`;
              let ipAJson = null;
              let ipBJson = null;
              try{
	         if (fs.existsSync(pathAYesterday)) {
                  ipAJson = await csv().fromFile(pathAYesterday);
                   }
              } catch(err) {
        
               }

               try{
	         if (fs.existsSync(pathBYesterday)) {
                  ipBJson = await csv().fromFile(pathBYesterday);
                   }
              } catch(err) {
        
               }
               let maxVal;
               let nodeName, nodeId;
               if(ipAJson && ipAJson.length && ipAJson[0].Succ != undefined && ipBJson && ipBJson.length && ipBJson.Succ!= undefined){
                   maxVal = findMaxFromRemoteArrays(ipAJson, ipBJson);
                   nodeName = currentPath.split('/')[1];
                   nodeId = currentPath.split('/')[2];
                   let obj = getObjFromAll(nodeName, nodeId) || {};
                   obj.nodeName = nodeName;
                   obj.nodeId = nodeId;
                   obj.Remote = maxVal; 
                   all.push(obj);
                } else if(ipAJson && ipAJson.length && ipAJson[0].Succ != undefined) {
                    maxVal = findMaxFromRemoteArray(ipAJson);
                   nodeName = currentPath.split('/')[1];
                   nodeId = currentPath.split('/')[2];let obj = getObjFromAll(nodeName, nodeId) || {};
                   obj.nodeName = nodeName;
                   obj.nodeId = nodeId;
                   obj.Remote = maxVal; 
                   all.push(obj);
                 } else if(ipBJson && ipBJson.length && ipBJson.Succ!= undefined) {
                    maxVal = findMaxFromRemoteArrays(ipBJson);
                   nodeName = currentPath.split('/')[1];
                   nodeId = currentPath.split('/')[2];
                   let obj = getObjFromAll(nodeName, nodeId) || {};
                   obj.nodeName = nodeName;
                   obj.nodeId = nodeId;
                   obj.Remote = maxVal; 
                   all.push(obj);
                 }
              
              maxFound.push(pathA);
              maxFound.push(pathB);
     }
     currentPathIndex++;
     getMaxPerNode();
}
function createFile() {

     if(currentPathIndex == totalPaths){
		console.log("Wrote all the files present");
              currentPathIndex = 0;
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
