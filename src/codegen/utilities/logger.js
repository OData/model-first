var DateTime = require('./datetime');

function Logger(logSuc, logInfo, logErr){
	var dateTime = new DateTime();
	var curr = dateTime.getCurrent('[yyyy/MM/dd hh:mm:ss]');
	var suc = logSuc;
	var info = logInfo;
	var err = logErr;

	this.logSuc = function(msg){
		if(suc){
			console.log('\x1b[0m\x1b[1m\x1b[32m%s: %s\x1b[0m', curr, msg);
		}
	};

	this.logInfo = function(msg){
		if(info){
			console.log('\x1b[0m\x1b[1m\x1b[36m%s: %s\x1b[0m', curr, msg);
		}
	};

	this.logErr = function(msg, fileName, position){
		if(err){
			console.log('\x1b[0m\x1b[1m\x1b[31m%s: %s\nFile name: %s, Position: %s\n\x1b[0m', curr, msg, fileName, position);
		}
	};
}

var instance = null;

exports.getInstance = function(logSuc, logInfo, logErr){
	if(logSuc || logInfo || logErr){
		instance = null;
	}
	if(null === instance){
		// The default value of logSuc is true; 
		// And the default value of logInfo is true;
		// And the default value of logErr is false.
		if(!logSuc){
			logSuc = true;
		}
		if(!logInfo){
			logInfo = true;
		}
		if(!logErr){
			logErr = false;
		}

		instance = new Logger(logSuc, logInfo, logErr);
	}

	return instance;
};