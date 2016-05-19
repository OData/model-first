var fs = require('fs');
var EasyZip = require('easy-zip').EasyZip;
var StringHelper = require('../helpers/stringhelper');
var Logger = require('./logger');
var constants = require('../config').Constants;

/*
** Zip the whole folder to a package.
** @params:
**     folderPath: The folder path.
**     zipPath: The path of target package.
**     callback: The callback function.
*/
exports.zipFolder = function(folderPath, zipPath, callback){
    var logger = Logger.getInstance();
    try{
        var easyZip = traverseFolder(folderPath);
        easyZip.writeToFile(zipPath);
        logger.logSuc('Finish to zip files');
        return callback();
    }
    catch(err){
        return callback(err);
    }
};

/*
** Traverse the target folder and its sub-folder, and set all the folders and files for EasyZip module.
** @params:
**     folderPath: The path of the folder which will be zipped.
**     easyZip: An instance of EasyZip. This parameter is only used in recursive invocations. Set it to null at first.
**     folder: An property of EasyZip instance. This parameter is only used in recursive invocations. Set it to null at first.
** @returns:
**     returns an EasyZip instance. 
*/
function traverseFolder(folderPath, easyZip, folder){
    if(!easyZip){
        easyZip = new EasyZip();
    }
    var folderName = StringHelper.getLastSegment(folderPath);
    folder = folder ? folder.folder(folderName) : easyZip.folder(folderName);
    var files = fs.readdirSync(folderPath);
    if(null !== files && null !== files.length && files.length > 0){
        for(var i = 0; i < files.length; i++){
            var filePath = StringHelper.addSlash(folderPath) + files[i];
            var stats = fs.statSync(filePath);
            if(stats.isFile()){
                var content = fs.readFileSync(filePath,{encoding:constants.Code.Encoding});
                folder.file(files[i], content);
            }
            else if(stats.isDirectory()){
                easyZip = traverseFolder(filePath, easyZip, folder);
            }
        }
    }

    return easyZip;
}