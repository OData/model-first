var fs = require('fs');
var config = require('../config');
var codegen = require('../modules/csharpClientCodegen');
var serverCodegen = require('../modules/csharpServerCodegen');

var constants = config.Constants;

exports.processSample = function (samplePath, callback){
	fs.readFile(samplePath, function(err, data){
		if(err){
			return callback(err, null);
		}
		var jObj = JSON.parse(data);

		var csharpCode = codegen.CodegenByObj(jObj);
		var result = {
			metadata: data, 
			csharpCode: csharpCode,
			namespace: jObj.api.namespace
		};

		return callback(null, result);
	});
};

exports.processInput = function (metadata){
	var csharpCode = codegen.Codegen(metadata);
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
		var jObj = JSON.parse(data);

		var files = serverCodegen.CodegenByObj(jObj);
		var result = {
			metadata: data, 
			files: files,
			namespace: jObj.api.namespace+'.Server'
		};

		return callback(null, result);
	});
};

exports.processInputForServer = function(metadata){
	var files = serverCodegen.Codegen(metadata);
	var result = {
		metadata: metadata, 
		files: files 
	};

	return result;
};