var fs = require('fs');
var config = require('../config');
var ctrlhelper = require('../helpers/controlhelper');
var codegen = require('../modules/csharpServerCodegen');
var codewriter = require('../utilities/codewriter');
var guid = require('../utilities/guid');
var zipper = require('../utilities/zipper');
var Logger = require('../utilities/logger');
var logger = Logger.getInstance();
var constants = config.Constants;

exports.get = function(req, res){
	var query = req.query;
	if(query){
		if(query.name == 'csharp'){
			logger.logInfo('Processing TripPin Sample metadata...');
			ctrlhelper.processSampleForServer(constants.Paths.TripPinMetadataSample, function(err, result){
				if(err){
					logger.logErr(err);
					return res.send('err');
				}

				logger.logInfo('Generating the CSharp server code for OData v4 service...');
				codewriter.createServerCSharpProject(constants.FileNames.ServerCSharpZipPackage, result.files, function(err, folderName){
					if(err){
						logger.logErr(err);
						return res.send(err);
					}

					zipper.zipFolder(constants.Paths.ServerCSharpPackage + folderName, constants.Paths.ServerCSharpZipPackage + folderName + '.zip', function(err){
						if(err){
							logger.logErr(err);
							return res.send('err');
						}

						setTimeout(function(){
							res.download(constants.Paths.ServerCSharpZipPackage + folderName + '.zip', folderName + '.zip');
							logger.logSuc('Success to download!');
						}, 1000);
					});
				});
			});	
		}
		else{
			logger.logErr('Cannot generate the ' + query.name + ' code!');
			res.send('Error: Cannot generate the ' + query.name + ' code!');
		}
	}
};

exports.post = function(req, res){
	var query = req.query;
	if(query){
		if(query.name == 'csharp'){
			if(req.body){
				logger.logInfo('Processing request\'s metadata...');
				var files = codegen.CodegenByObj(req.body, constants.Code.ServerDefaultNamespace);
				logger.logInfo('Generating the CSharp server code for OData v4 service...');
				codewriter.createServerCSharpProject(constants.FileNames.ServerCSharpZipPackage, files, function(err, folderName){
					if(err){
						logger.logErr(err);
						return res.send('err');
					}

					zipper.zipFolder(constants.Paths.ServerCSharpPackage + folderName, constants.Paths.ServerCSharpZipPackage + folderName + '.zip', function(err){
						if(err){
							logger.logErr(err);
							return res.send('err');
						}

						//res.download(constants.Paths.ServerCSharpZipPackage + folderName + '.zip', folderName + '.zip');
						res.send({link: !!req.connection.encrypted ? 'https://' : 'http://' + req.headers.host + constants.Paths.ServerCSharpZipPackage.substr(1) + folderName + '.zip'});
						logger.logSuc('Success to download!');
					});
				});
			}
		}
		else{
			logger.logErr('Cannot generate the ' + query.name + ' code!');
			res.send('Error: Cannot generate the ' + query.name + ' code!');
		}
	}
};