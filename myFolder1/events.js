//Events emitted always have types that are string - data/end/

function anEmitter(){
	var em = new (require('events').EventEmitter)();
	em.emit('error', new Error('My mistake'));	
}

var aUtil = require('util');
function MyClass(){
	
}

var EventEmitter = require('events').EventEmitter;

var anObj = function() {
		
}


aUtil.inherits(anObj, EventEmitter);

anObj.prototype.anEmitterFunction = function(){
	this.emit('error', new Error('My mistake'));			
};


module.exports = anObj;

/*em.emit('event1');
em.emit('error', new Error('My mistake'));*/