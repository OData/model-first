var express = require('express');
var path = require('path');
var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./router');
var config = require('./config');
var Logger = require('./utilities/logger');
var constants = config.Constants;

var logger = Logger.getInstance(constants.Logs.Suc, constants.Logs.Info, constants.Logs.Err);

var DirectoryManager = require('./utilities/directoryMgr');
var dmgr = new DirectoryManager();
var paths = [
    constants.Paths.CSharpPackage,
    constants.Paths.CSharpZipPackage,
    constants.Paths.ServerCSharpPackage,
    constants.Paths.ServerCSharpZipPackage
];
dmgr.create(paths);

var app = express();

// view engine setup
app.set('views', constants.Paths.Views);
app.set('view engine', 'ejs');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use('/public/client', function (req, res, next) {
    res.header('Content-Disposition', 'attachment');
    next();
});
app.use('/public/server', function (req, res, next) {
    res.header('Content-Disposition', 'attachment');
    next();
});

app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    cookie: {maxAge: 60000},
    secret: 'codegen',
    resave: false,
    saveUninitialized: false}));
app.use(flash());
app.use(express.static(path.join(__dirname, constants.Paths.Static)));

app.use(function (req, res, next) {
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
    logger.logSuc('Started connect codegen web service on http://localhost:' + constants.Port + '/');
    logger.logInfo('Download OData client C# code on:');
    logger.logInfo('-- HTTP GET / POST: http://localhost:' + constants.Port + '/client/codegen/?name=csharp');
    logger.logInfo('Download OData server C# code on:');
    logger.logInfo('-- HTTP GET / POST: http://localhost:' + constants.Port + '/server/codegen/?name=csharp');
    logger.logInfo('OData client CodeGen Testing Entry: http://localhost:' + constants.Port + '/gen-client/');
    logger.logInfo('OData server CodeGen Testing Entry: http://localhost:' + constants.Port + '/gen-server/');
});