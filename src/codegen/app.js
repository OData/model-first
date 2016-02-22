var express = require('express');
var router = require('./router');
var config = require('./config');
var DirectoryManager = require('./utilities/directoryMgr');

var app = express();
var constants = config.Constants;
var dmgr = new DirectoryManager();
var paths = [
constants.CSharpCode,
constants.CSharpZipPackage
];
dmgr.create(paths);
app.use(express.static(constants.Paths.Static));

router.route(app);

var server = app.listen(constants.Port, function(){
	console.log('Started connect codegen web service on http://localhost:' + constants.Port);
	console.log('HTTP GET or POST: Download OData client C# code on http://localhost:' + constants.Port + '/client/codegen/?name=csharp');
});