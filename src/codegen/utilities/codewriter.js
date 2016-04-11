var fs = require('fs');
var util = require('util');
var StringHelper = require('../helpers/stringhelper');
var DateTime = require('./datetime');
var Guid = require('./guid');
var config = require('../config');
var constants = config.Constants;

/*
** Create a csharp project's directory structure and necessary files on './public/client/csharp/packages/' folder.
** params: 
**     projName: The project name (user definition).
**     callback: The callback function.
*/
exports.createCSharpProject = function(projName, coreContent, callback){
	var folderName = genPackageName(projName, constants.FileNames.RandomStringLen);
	try{
		var folderPathes = [
			constants.Paths.CSharpPackage + folderName,
			constants.Paths.CSharpPackage + folderName + '/packages',
			constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder,
			constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder + '/Properties'
		];

		createFolders(folderPathes, function(err){
			if(err){
				return callback(err);
			}

			var filePathes = [
					constants.Paths.CSharpProj + 'App.config',
					constants.Paths.CSharpProj + 'packages.config',
					constants.Paths.CSharpProj + 'Program.cs'
			];
			copyFiles(filePathes, constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder, function(err){
				if(err){
					return callback(err);
				}
				
				insertCSharpProjFile(folderName, function(err){
					if(err){
						return callback(err);
					}

					insertCSharpAssmFile(folderName, function(err){
						if(err){
							return callback(err);
						}

						insertCSharpCoreFile(coreContent, folderName, function(err){
							if(err){
								return callback(err);
							}

							return callback(null, folderName);
						});
					});
				});
			});
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
		fs.writeFile(filePath, coreContent, function(err){
			if(err){
				return callback(err);
			}

			return callback();
		});
	}
	catch(err){
		return callback(err);
	}
}

/*
** Insert project file to the project folder.
** params: 
**     folderName: The project folder name.
**     callback: The callback function.
*/
function insertCSharpProjFile(folderName, callback){
	var projFileSrcPath = constants.Paths.CSharpProj + constants.FileNames.CSharpProjFile;
	updateCSharpProjContent(projFileSrcPath, function(err, data){
		if(err){
			return callback(err);
		}

		var projFileTargetPath = constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder + '/' + constants.FileNames.CSharpProjFile;
		try{
			fs.writeFile(projFileTargetPath, data, constants.Code.Encoding, function(err){
				if(err){
					return callback(err);
				}

				return callback();
			});
		}
		catch(err){
			return callback(err);
		}
	});
}

/*
** Insert assembly file to the project folder.
** params: 
**     folderName: The project folder name.
**     callback: The callback function.
*/
function insertCSharpAssmFile(folderName, callback){
	var assmFileSrcPath = constants.Paths.CSharpProj + 'Properties/' + constants.FileNames.CSharpAssemblyFile;
	updateCSharpAssmContent(assmFileSrcPath, function(err, data){
		if(err){
			return callback(err);
		}

		var assmFileTargetPath = constants.Paths.CSharpPackage + folderName + '/' + constants.FileNames.CSharpProjFolder + '/Properties/' + constants.FileNames.CSharpAssemblyFile;
		try{
			fs.writeFile(assmFileTargetPath, data, constants.Code.Encoding, function(err){
				if(err){
					return callback(err);
				}

				return callback();
			});
		}
		catch(err){
			return callback(err);
		}
	});
}

/*
** Update GUID to project file.
** params: 
**     filePath: The path of 'ODataServiceV4Client.csproj' file which will be updated.
**     callback: The callback function.
*/
function updateCSharpProjContent(filePath, callback){
	var guid = Guid.NewGuid();
	try{
		fs.readFile(filePath, constants.Code.Encoding, function(err, data){
			if(err){
				return callback(err);
			}

			return callback(null, util.format(data, guid));
		});
	}
	catch(err){
		return callback(err);
	}
}

/*
** Update namespace information and GUID to assembly file.
** params: 
**     filePath: The path of 'AssemblyInfo.cs' file which will be updated.
**     callback: The callback function.
*/
function updateCSharpAssmContent(filePath, callback){
	var guid = Guid.NewGuid();
	try{
		fs.readFile(filePath, constants.Code.Encoding, function(err, data){
			if(err){
				return callback(err);
			}

			return callback(null, util.format(data, constants.Code.DefaultNamespace, constants.Code.DefaultNamespace, guid));
		});
	}
	catch(err){
		return callback(err);
	}
}

/*
** Copy files to a target folder.
** params: 
**     filePathes: The file's pathes which will be copied.
**     destFolder: The target folder path.
**     callback: The callback function.
*/
function copyFiles(filePathes, destFolder, callback){
	// Check wether the folder is exist. 
	// If the folder is not exist, the function will create this folder.
	createFolder(destFolder, function(err, folderPath){
		if(err){
			return callback(err);
		}

		try{
			for(var i = 0; i < filePathes.length; i++){
				if(!copySync(filePathes[i], destFolder)){
					throw new Error(util.format('Copy file \'%s\' failed!', filePaths[i]));
				}
			}

			return callback();
		}
		catch(err){
			return callback(err);
		}
	});
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
	var stat = fs.statSync(filePath);
	if(stat.isFile()){
		try{
    		var readStream = fs.createReadStream(filePath);
	    	var dest = StringHelper.addSlash(destFolder) + StringHelper.getLastSegment(filePath);
	    	var writeStream = fs.createWriteStream(dest);
	    	readStream.pipe(writeStream);

	    	return true;
    	}
    	catch(err){
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
			fs.mkdir(folderPath);

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