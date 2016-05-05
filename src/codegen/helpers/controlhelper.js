var fs = require('fs');
var config = require('../config');
var codegen = require('../modules/csharpClientCodegen');
var serverCodegen = require('../modules/csharpServerCodegen');

var constants = config.Constants;
var defaultNamespace = constants.Code.DefaultNamespace;
var serverDefaultNamespace = constants.Code.ServerDefaultNamespace;

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

exports.processSampleForServer = function(samplePath, callback){
	fs.readFile(samplePath, function(err, data){
		if(err){
			return callback(err, null);
		}

		var files = serverCodegen.Codegen(data, serverDefaultNamespace);
		var result = {
			metadata: data, 
			files: files 
		};

		return callback(null, result);
	});
};

exports.processInputForServer = function(metadata){
	var files = serverCodegen.Codegen(metadata, serverDefaultNamespace);
	var result = {
		metadata: metadata, 
		files: files 
	};

	return result;
};