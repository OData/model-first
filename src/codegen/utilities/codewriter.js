//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

var fs = require('fs');
var util = require('util');
var StringHelper = require('../helpers/stringHelper');
var DateTime = require('./datetime');
var Guid = require('./guid');
var config = require('../config');
var constants = config.Constants;
var Logger = require('./logger');
var logger = Logger.getInstance();
/*
** Create a csharp server project's directory structure and necessary files on './public/server/csharp/packages/' folder.
** params: 
**     projName: The project name (user definition).
**     callback: The callback function.
*/
exports.createServerCSharpProject = function(projName, files, namespaceName, callback){
	var result = false;
	var folderName = genPackageName(projName, constants.FileNames.RandomStringLen);
	try{
		var folderPathes = [
			constants.Paths.ServerCSharpPackage + folderName,
			constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder,
			constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder + '/Api',
			constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder + '/App_Data',
			constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder + '/App_Start',
			constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder + '/Controllers',
			constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder + '/Models',
			constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder + '/Submit',
			constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder + '/Properties',
			constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder + '/packages'
		];
		createFolders(folderPathes, function(err){
			if(err){
				return callback(err);
			}

			var filePathes = [
			constants.Paths.ServerCSharpProj + 'packages.config',
			constants.Paths.ServerCSharpProj + 'Web.config',
			constants.Paths.ServerCSharpProj + 'Web.Debug.config',
			constants.Paths.ServerCSharpProj + 'Web.Release.config'
			];

			result =copyFiles(filePathes, constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder, function(err){
				callback(err);
			});
			if(!result){return;}

			filePathes = [
			'Global.asax',
			'Global.asax.cs',
			'App_Start/WebApiConfig.cs',
			'Api/DemoApi.cs',
			'Controllers/DemoController.cs',
			'Submit/CustomizedSubmitProcessor.cs'
			];
			result = copyAndReplaceNamespace(filePathes, constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder+'/', namespaceName, function(err){
				callback(err);
			});
			if(!result){return;}

			var compileInfos = insertServerCSharpModelFiles(files, folderName);
			var projFileSrcPath = constants.Paths.ServerCSharpProj + constants.FileNames.ServerCSharpProjFile;
			var projFileTargetPath = constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder + '/' + constants.FileNames.ServerCSharpProjFile;
			insertCSharpProjFile(folderName, namespaceName, compileInfos, projFileSrcPath, projFileTargetPath, function(err){
				callback(err);
			});
			if(!result){return;}

			var assmFileSrcPath = constants.Paths.ServerCSharpProj + 'Properties/' + constants.FileNames.CSharpAssemblyFile;
			var assmFileTargetPath = constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder + '/Properties/' + constants.FileNames.CSharpAssemblyFile;
			insertCSharpAssmFile(folderName, namespaceName, assmFileSrcPath, assmFileTargetPath, function(err){
				callback(err);
			});
			if(!result){return;}

			return callback(null, folderName);
		});			
	}
	catch(err){
		return callback(err);
	}
};

/*
** Insert model files to the csharp server project folder.
** params: 
**     files: The model files information for OData v4 service server.
**     folderName: The project folder name.
**     callback: The callback function.
*/
function insertServerCSharpModelFiles(files, folderName){
	try{
		var compileInfos = '';
		var filePath = constants.Paths.ServerCSharpPackage + folderName + '/' + constants.FileNames.ServerCSharpProjFolder + '/Models/';
		for(var i = 0; i < files.length; i++){
			fs.writeFileSync(filePath + files[i].fileName, files[i].content);
			compileInfos += '        ' + files[i].compileInfo;
			if(i !== files.length - 1){
				compileInfos += '\n';
			}
		}

		return compileInfos;
	}
	catch(err){
		throw new Error(err);
	}
}

/*
** Create a csharp project's directory structure and necessary files on './public/client/csharp/packages/' folder.
** params: 
**     projName: The project name (user definition).
**     callback: The callback function.
*/
exports.createCSharpProject = function(projName, coreContent, namespaceName, callback){
	var folderName = genPackageName(projName, constants.FileNames.RandomStringLen);
	try{
		var folderPathes = [
			constants.Paths.CSharpPackage + folderName,
			constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder,
			constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder + '/Properties',
			constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder + '/packages'
		];

		createFolders(folderPathes, function(err){
			var result =false;
			if(err){
				return callback(err);
			}

			var filePathes = [
			constants.Paths.CSharpProj + 'App.config',
			constants.Paths.CSharpProj + 'packages.config',
			constants.Paths.CSharpProj + 'Program.cs'
			];
			result = copyFiles(filePathes, constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder, function(err){
				callback(err);
			});
			if(!result){return;}

			var projFileSrcPath = constants.Paths.CSharpProj + constants.FileNames.CSharpProjFile;
			var projFileTargetPath = constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder + '/' + constants.FileNames.CSharpProjFile;
			result = insertCSharpProjFile(folderName, namespaceName, null, projFileSrcPath, projFileTargetPath, function(err){
				callback(err);
			});
			if(!result){return;}

			var assmFileSrcPath = constants.Paths.CSharpProj + 'Properties/' + constants.FileNames.CSharpAssemblyFile;
			var assmFileTargetPath = constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder + '/Properties/' + constants.FileNames.CSharpAssemblyFile;
			result = insertCSharpAssmFile(folderName, namespaceName, assmFileSrcPath, assmFileTargetPath, function(err){
				callback(err);
			});
			if(!result){return;}

			result = insertCSharpCoreFile(coreContent, folderName, function(err){
				callback(err); 
			});	
			if(!result){return;}

			return callback(null, folderName);		
		});
	}
	catch(err){
		return callback(err);
	}
};

/*
** Insert core file to the project folder.
** params: 
**     coreContent: The core csharp code for OData v4 service client.
**     folderName: The project folder name.
**     callback: The callback function.
*/
function insertCSharpCoreFile(coreContent, folderName, callback){
	var filePath = constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder + '/' + constants.FileNames.CSharpCode;
	try{
		fs.writeFileSync(filePath, coreContent, {encoding:constants.Code.Encoding});
	}
	catch(err){
		callback(err);
		return false;
	}
	return true;
}

/*
** Insert project file to the project folder.
** params: 
**     folderName: The project folder name.
**     namespaceName: The namespace name.
**     compileInfos: The compile information will be added to project file.
**     projFileSrcPath: The source path of project file.
**     projFileTargetPath: The target path of project file.
**     callback: The callback function.
*/
function insertCSharpProjFile(folderName, namespaceName, compileInfos, projFileSrcPath, projFileTargetPath, callback){
	var result =false;
	updateCSharpProjContent(projFileSrcPath, namespaceName, compileInfos, function(err, data){
		if(err){
			return callback(err);
		}

		try{
			fs.writeFileSync(projFileTargetPath, data, constants.Code.Encoding);
			result = true;
		}
		catch(err){
			return callback(err);
		}
	});
	return result;
}

/*
** Insert assembly file to the project folder.
** params: 
**     folderName: The project folder name.
**     namespaceName: The namespace name.
**     assmFileSrcPath: The source path of assembly file.
**     assmFileTargetPath: The target path of assembly file.
**     callback: The callback function.
*/
function insertCSharpAssmFile(folderName, namespaceName, assmFileSrcPath, assmFileTargetPath, callback){
	var result=false;
	updateCSharpAssmContent(assmFileSrcPath, namespaceName, function(err, data){
		if(err){
			return callback(err);
		}

		try{
			fs.writeFileSync(assmFileTargetPath, data, constants.Code.Encoding)
			result = true;
		}
		catch(err){
			return callback(err);
		}
	});
	return result;
}

/*
** Update GUID to project file.
** params: 
**     filePath: The path of 'ODataServiceV4Client.csproj' file which will be updated.
**     projName: The name of csharp project.
**     compileInfos: The compile information will be added to project file.
**     callback: The callback function.
*/
function updateCSharpProjContent(filePath, namespaceName, compileInfos, callback){
	var guid = Guid.NewGuid();
	try{
		var data = fs.readFileSync(filePath, constants.Code.Encoding);

		if(compileInfos){
			return callback(null, util.format(data, guid, namespaceName, namespaceName, compileInfos));
		}
		else{
			return callback(null, util.format(data, guid, namespaceName, namespaceName));
		}
	}
	catch(err){
		return callback(err);
	}
}

/*
** Update namespace information and GUID to assembly file.
** params: 
**     filePath: The path of 'AssemblyInfo.cs' file which will be updated.
**     namespaceName: The namespace name.
**     callback: The callback function.
*/
function updateCSharpAssmContent(filePath, namespaceName, callback){
	var guid = Guid.NewGuid();
	try{
		var data = fs.readFileSync(filePath, constants.Code.Encoding)
	}
	catch(err){
		return callback(err);
	}
	return callback(null, util.format(data, namespaceName, namespaceName, guid));
}

/*
** Copy files to a target folder.
** params: 
**     filePathes: The file's pathes which will be copied.
**     destFolder: The target folder path.
**     callback: The callback function.
*/
function copyFiles(filePathes, destFolder, callback){
	try{
		for(var i = 0; i < filePathes.length; i++){
			if(!copySync(filePathes[i], destFolder)){
				throw new Error(util.format('Copy file \'%s\' failed!', filePathes[i]));
			}
		}

		return true;
	}
	catch(err){
		callback(err);
		return false;
	}
}

/*
** Copy file to a target folder.
** params: 
**     filePath: The path of the file which will be copied.
**     destFolder: The target folder path.
**     callback: The callback function.
*/
// This method can be removed in this submit (2016/4/11).
function copy(filePath, destFolder, callback){
	fs.stat(filePath, function (err, stats){
		if(err){
			return callback(err);
		}

		if(stats.isFile()){
			try{
				var readStream = fs.createReadStream(filePath);
				var dest = StringHelper.addSlash(destFolder) + StringHelper.getLastSegment(filePath);
				var writeStream = fs.createWriteStream(dest);
				readStream.pipe(writeStream);

				return callback();
			}
			catch(err){
				return callback(err);
			}
		}
	});
}

function copyAndReplaceNamespace(filePathes, destFolder, namespaceName, callback){
	for(var i = 0; i < filePathes.length; i++){
		try{
			var content = fs.readFileSync(constants.Paths.ServerCSharpProj+filePathes[i], constants.Code.Encoding);
			fs.writeFileSync(destFolder+filePathes[i] , content.replace(/%s/g, namespaceName), constants.Code.Encoding);
		} catch(e)
		{
			callback(e);
			return false;
		}
	}
	return true;
}

/*
** [Synchronize] Copy file to a target folder.
** params: 
**     filePath: The path of the file which will be copied.
**     destFolder: The target folder path.
** returns:
**	   boolean value.
*/
function copySync(filePath, destFolder){
	var BUF_LENGTH = 64*1024;
	var buff = new Buffer(BUF_LENGTH);
	var stat = fs.statSync(filePath);
	if(stat.isFile()){
		try{
			var fdr = fs.openSync(filePath,'r');
			var dest = StringHelper.addSlash(destFolder) + StringHelper.getLastSegment(filePath);
			var fdw = fs.openSync(dest, 'w');
			var bytesRead = 1, pos = 0;
			while (bytesRead > 0)
			{
				bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
				fs.writeSync(fdw,buff,0,bytesRead);
				pos += bytesRead;
			}
			fs.closeSync(fdr)
			fs.closeSync(fdw)
			return true;
		}
		catch(err){
			fs.closeSync(fdr)
			fs.closeSync(fdw)
			return false;
		}
	}

	return false;
}

/*
** Create all the folders.
** params: 
**     folderPathes: The folder pathes which will be created.
**     callback: The callback function.
*/
function createFolders(folderPathes, callback){
	var pattern = 'Create folder \'%s\' failed!';
	try{
		for(var i = 0; i < folderPathes.length; i++){
			var res = createFolderSync(folderPathes[i]);
			if(!res){
				throw new Error(pattern, folderPathes[i]);
			}
		}
		return callback();
	}
	catch(err){
		return callback(err);
	}
}

/*
** Create a new folder. If the folder is exist, this method will execute the callback function directly.
** params: 
**     folderPath: The folder path which will be created.
**     callback: The callback function.
*/
// This method can be removed in this submit (2016/4/11).
function createFolder(folderPath, callback){
	fs.exists(folderPath, function(exists){
		if(exists){
			return callback(null, folderPath);
		}
		else{
			fs.mkdir(folderPath, function(err){
				if(err){
					return callback(err);
				}

				return callback(null, folderPath);
			});
		}
	});
}

/*
** [Synchronize] Create a new folder. 
** If the folder is exist, this method will execute the callback function directly.
** params: 
**     folderPath: The folder path which will be created.
** returns:
**     boolean value.
*/
function createFolderSync(folderPath){
	if(!fs.exists(folderPath)){
		try{
			fs.mkdirSync(folderPath);

			return true;
		}
		catch(err){
			return false;
		}
	}

	return true;
}

/*
** Generate package name for every project.
** params: 
**     baseName: The name is defined by user.
**     randomStrLength: The random string length after base name and date-time string.
*/
function genPackageName(baseName, randomStrLength){
	var dateTime = new DateTime();
	var curr = dateTime.getCurrent('yyyyMMddhhmmss');

	return baseName + '_' + curr + genRandomString(randomStrLength);
}

/*
** Generate random string for a package name.
** params: 
**     length: The random string length.
*/
function genRandomString(length){
	var elements = '0123456789abcdefghigklmnopqrstuvwxyz';
	var result = '';
	while(length-- > 0){
		var index = Math.floor(Math.random() * elements.length);
		result += elements[index];
	}
	
	return result;
}