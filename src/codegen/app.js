var express = require('express');
var path = require('path');
var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./router');
var config = require('./config');
var constants = config.Constants;

var DirectoryManager = require('./utilities/directoryMgr');
var dmgr = new DirectoryManager();
var paths = [
    constants.Paths.CSharpCode,
    constants.Paths.CSharpZipPackage
];
dmgr.create(paths);

var app = express();

// view engine setup
app.set('views', constants.Paths.Views);
app.set('view engine', 'ejs');

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ 
	cookie: { maxAge: 60000 }, 
    secret: 'codegen',
    resave: false, 
    saveUninitialized: false}));
app.use(flash());
app.use(express.static(path.join(__dirname, constants.Paths.Static)));

app.use(function(req, res, next){
  var title = req.flash('title');
  res.locals.title = title.length ? title : 'CodeGen';

  var metadata = req.flash('metadata');
  res.locals.metadata = metadata.length ? metadata : 'Load A Sample First!';

  var csharpCode = req.flash('csharpCode');
  res.locals.csharpCode = csharpCode.length ? csharpCode : 'No Results!';

  next();
});

app.use('/', routes);

var server = app.listen(constants.Port, function () {
    console.log('Started connect codegen web service on http://localhost:' + constants.Port + '/');
    console.log('HTTP GET or POST: Download OData client C# code on http://localhost:' + constants.Port + '/client/codegen/?name=csharp');
});