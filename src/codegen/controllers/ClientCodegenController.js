var fs = require('fs');
var config = require('../config');
var codegen = require('../modules/csharpClientCodegen');
var ctrlhelper = require('../helpers/controlhelper');
var codewriter = require('../utilities/codewriter');
var guid = require('../utilities/guid');
var zipper = require('../utilities/zipper');
var Logger = require('../utilities/logger');
var constants = config.Constants;

exports.get = function(req, res){
    var logger = Logger.getInstance();
    var query = req.query;
    if(query){
        if(query.name == 'csharp'){
            logger.logInfo('Processing TripPin Sample metadata...');
            ctrlhelper.processSample(constants.Paths.TripPinMetadataSample, function(err, result){
                if(err){
                    logger.logErr(err);
                    return res.send('err');
                }

                logger.logInfo('Generating the CSharp code for OData v4 service...');
                codewriter.createCSharpProject(constants.FileNames.CSharpZipPackage, result.csharpCode, result.namespace, function(err, folderName){
                    if(err){
                        logger.logErr(err);
                        return res.send('err');
                    }

                    zipper.zipFolder(constants.Paths.CSharpPackage + folderName, constants.Paths.CSharpZipPackage + folderName + '.zip', function(err){
                        if(err){
                            logger.logErr(err);
                            return res.send('err');
                        }

                        setTimeout(function(){
                            res.download(constants.Paths.CSharpZipPackage + folderName + '.zip', folderName + '.zip');
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

exports.post = function (req, res) {
    var logger = Logger.getInstance();
    var query = req.query;
    if(query){
        if(query.name == 'csharp'){
            if(req.body){
                logger.logInfo('Processing request\'s metadata...');
                var csharpCode = codegen.CodegenByObj(req.body);
                logger.logInfo('Generating the CSharp code for OData v4 service...');
                codewriter.createCSharpProject(constants.FileNames.CSharpZipPackage, csharpCode, req.body.api.namespace, function(err, folderName){
                    if(err){
                        logger.logErr(err);
                        return res.send('err');
                    }

                    zipper.zipFolder(constants.Paths.CSharpPackage + folderName, constants.Paths.CSharpZipPackage + folderName + '.zip', function(err){
                        if(err){
                            logger.logErr(err);
                            return res.send('err');
                        }

                        // Remove the string './public'.
                        var path = constants.Paths.CSharpZipPackage.substr(8);
                        res.send({link: !!req.connection.encrypted ? 'https://' : 'http://' + req.headers.host + path + folderName + '.zip'});
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
