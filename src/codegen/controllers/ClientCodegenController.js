var fs = require('fs');
var config = require('../config');
var codegen = require('../modules/csharpClientCodegen');
var ctrlhelper = require('../helpers/controlhelper');
var codewriter = require('../utilities/codewriter');
var zipper = require('../utilities/zipper');

var constants = config.Constants;

function csharpCodeWriter(content){
	codewriter.writeCodes(constants.FileNames.CSharpCode, constants.Paths.CSharpCode, content);
}

function zipCSharpCodes(){
	var files = [
		{ name: constants.FileNames.CSharpCode, path: constants.Paths.CSharpCode + constants.FileNames.CSharpCode }
	];

	zipper.zip(files, constants.Paths.CSharpZipPackage + constants.FileNames.CSharpZipPackage);
}

exports.get = function(req, res){
	var query = req.query;
	if(query){
		if(query.name == 'csharp'){
			ctrlhelper.processSample(constants.Paths.TripPinMetadataSample, function(err, result){
				csharpCodeWriter(result.csharpCode);
				zipCSharpCodes();
				res.download(constants.Paths.CSharpZipPackage + constants.FileNames.CSharpZipPackage, constants.FileNames.CSharpZipPackage);
			});
		}
		else{
			res.send('Error: Cannot generate the ' + query.name + ' code!');
		}
	}
};

exports.post = function(req, res){
	var query = req.query;
	if(query){
		if(query.name == 'csharp'){
			if(req.body){
				csharpCodeWriter(codegen.CodegenByObj(req.body, constants.Code.DefaultNamespace));
				zipCSharpCodes();
				res.download(constants.Paths.CSharpZipPackage + constants.FileNames.CSharpZipPackage, constants.FileNames.CSharpZipPackage);
			}
		}
		else{
			res.send('Error: Cannot generate the ' + query.name + ' code!');
		}
	}
};
