var bodyParser = require('body-parser');
var ClientCodegenController = require('./controllers/ClientCodegenController');

function route(app){
	var urlEncodeParser = bodyParser.urlencoded({ extended: false });
	var jsonParser = bodyParser.json();

	app.use(urlEncodeParser);
	app.use(jsonParser);

	app.get('/', function(request, response){
		response.send('Hello world!');
	});

	app.get('/client/codegen', ClientCodegenController.get);
	
	app.post('/client/codegen', ClientCodegenController.post);
}

exports.route = route;