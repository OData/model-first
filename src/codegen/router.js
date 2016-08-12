//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

var express = require('express');
var ClientCodegenController = require('./controllers/ClientCodegenController');
var ServerCodegenController = require('./controllers/ServerCodegenController');
var SampleController = require('./controllers/SampleController');
var router = express.Router();

/* Get code-gen testing home page. */
router.get('/', function(req, res, next){
	res.render('index');
});

router.get('/gen-client', function(req, res, next){
	res.render('modelfirst_codegen');
});

router.get('/gen-server', function(req, res, next){
	res.render('modelfirst_codegen_server');
});

/* Get samples */
router.get('/sample', SampleController.get);
/* Post Json metadata and convert it to C# codes */
router.post('/sample', SampleController.post);
/* Get samples for server code-gen */
router.get('/svrSample', SampleController.getServer);
/* Post Json metadata and convert it to C# server side codes*/
router.post('/svrSample', SampleController.postServer);

/* Get code-gen testing service api. */
router.get('/client/codegen', ClientCodegenController.get);
/* Post code-gen service api. */
router.post('/client/codegen', ClientCodegenController.post);

/* Get server code-gen testing service api. */
router.get('/server/codegen', ServerCodegenController.get);
/* Post server code-gen service api. */
router.post('/server/codegen', ServerCodegenController.post);

module.exports = router;