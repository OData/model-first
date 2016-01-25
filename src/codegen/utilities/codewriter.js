var fs = require('fs');
var StringHelper = require('../helpers/stringhelper');

exports.writeCodes = function(filename, filepath, content){
	filepath = StringHelper.addSlash(filepath);
	fs.writeFile(filepath + filename, content, function(err){
		if(err){
			return console.error(err);
		}
	});
};