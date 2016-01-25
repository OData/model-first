var express = require('express');
var router = require('./router');
var config = require('./config');

var app = express();
var constants = config.Constants;

app.use(express.static(constants.Paths.Static));

router.route(app);

var server = app.listen(constants.Port, function(){
	console.log('Started connect codegen web service on http://localhost:' + constants.Port);
});