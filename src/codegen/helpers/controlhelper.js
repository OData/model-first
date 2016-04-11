var fs = require('fs');
var config = require('../config');
var codegen = require('../modules/csharpClientCodegen');

var constants = config.Constants;
var defaultNamespace = constants.Code.DefaultNamespace;

exports.processSample = function (samplePath, callback){
	fs.readFile(samplePath, function(err, data){
		if(err){
			return callback(err, null);
		}

		var csharpCode = codegen.Codegen(data, defaultNamespace);
		var result = {
			metadata: data, 
			csharpCode: csharpCode 
		};

		return callback(null, result);
	});
};

exports.processInput = function (metadata){
	var csharpCode = codegen.Codegen(metadata, defaultNamespace);
	var result = {
		metadata: metadata,
		csharpCode: csharpCode
	};

	return result;
};