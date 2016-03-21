var express = require('express');
var ClientCodegenController = require('./controllers/ClientCodegenController');
var SampleController = require('./controllers/SampleController');
var router = express.Router();

/* Get code-gen testing home page. */
router.get('/', function(req, res, next){
	res.render('modelfirst_codegen');
});

/* Get samples */
router.get('/sample', SampleController.get);
/* Post Json metadata and convert it to C# codes */
router.post('/sample', SampleController.post);

/* Get code-gen testing service api. */
router.get('/client/codegen', ClientCodegenController.get);
/* Post code-gen service api. */
router.post('/client/codegen', ClientCodegenController.post);

module.exports = router;