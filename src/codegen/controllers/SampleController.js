//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

var fs = require('fs');
var config = require('../config');
var codegen = require('../modules/csharpClientCodegen');
var ctrlhelper = require('../helpers/controlHelper');
var constants = config.Constants;

exports.get = function(req, res){
	var query = req.query;
	if(query){
		if(query.name === 'todo'){
			ctrlhelper.processSample(constants.Paths.ToDoMetadataSample, function(err, result){
				if(err){
					return console.error(err);
				}
				
				req.flash('title', 'Model-first CodeGen');
				req.flash('metadata', result.metadata.toString());
				req.flash('csharpCode', result.csharpCode);
				return res.redirect('/gen-client');
			});
		}
		else if(query.name === 'trippin'){
			ctrlhelper.processSample(constants.Paths.TripPinMetadataSample, function(err, result){
				if(err){
					return console.error(err);
				}
				
				req.flash('title', 'Model-first CodeGen');
				req.flash('metadata', result.metadata.toString());
				req.flash('csharpCode', result.csharpCode);
				return res.redirect('/gen-client');
			});
		}
		else{
			res.send('Error: Cannot load the ' + query.name + ' sample!');
		}
	}
};

exports.post = function(req, res){
	var result = '';
	var query = req.query;
	if(!query){
		return res.sendStatus(404);
	}

	if(query.code === 'csharp'){
		if(!req.body){
			return res.sendStatus(400);
		}
		
		var data = removeBackslash(JSON.stringify(req.body));
		result = ctrlhelper.processInput(data);
		res.end(result.csharpCode);
	}
	else{
		return res.sendStatus(404);
	}

	
};

exports.getServer = function(req, res){
	var query = req.query;
	if(query){
		if(query.name === 'todo'){
			ctrlhelper.processSampleForServer(constants.Paths.ToDoMetadataSample, function(err, result){
				if(err){
					return console.error(err);
				}
				
				res.send({ 'metadata': result.metadata.toString(), 'files': result.files });
			});
		}
		else if(query.name === 'trippin'){
			ctrlhelper.processSampleForServer(constants.Paths.TripPinMetadataSample, function(err, result){
				if(err){
					return console.error(err);
				}
				
				res.send({ 'metadata': result.metadata.toString(), 'files': result.files });
			});
		}
		else{
			res.send('Error: Cannot load the ' + query.name + ' sample!');
		}
	}
};

exports.postServer = function(req, res){
	var query = req.query;
	if(!query){
		return res.sendStatus(404);
	}

	if(query.code === 'csharp'){
		if(!req.body){
			return res.sendStatus(400);
		}
		
		var data = removeBackslash(JSON.stringify(req.body));
		var files = ctrlhelper.processInputForServer(data).files;
		res.send(files);
	}
	else{
		return res.sendStatus(404);
	}
};

function removeBackslash(str){
	var result = '';
	for(var i = 0; i < str.length; i++){
		if(str[i] !== '\\'){
			result += str[i];
		}
	}

	return result;
}