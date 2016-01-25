var fs = require('fs');

exports.zip = function(files, zipPath){
	var NativeZip = require('node-native-zip');
	var archive = new NativeZip();
	archive.addFiles(files, function (err){
		if (err){
			return console.log('Error while adding files', err); 
		}

		var buff = archive.toBuffer(); 

	    fs.writeFile(zipPath, buff, function () { 
	        console.log('Finish to zip files'); 
	    }); 
	}); 
};
exports.verify = function(files){
	var exists = false;
	for(var i in files){
		var path = files[i].path;
		exists = fs.existsSync(path);
		if(!exists){
			console.log('File ' + files[i].name + ' is not found!');

			return false;	
		}	
	}
	console.log('Found them!');
	return true;
};
exports.verifyZip = function(zip){
	var exists = fs.existsSync(zip);
	if(exists){
		console.log('Found it!');
	}
	else{
		console.log('Cannot find the file on the path ' + zip);
	}

	return exists;
};