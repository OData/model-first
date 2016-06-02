'use strict';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/zenburn.css');
require('codemirror/theme/mdn-like.css');

//require('public/stylesheets/bootstrap.min.css');
//require('public/stylesheets/bootstrap-theme.min.css');
require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/css/bootstrap-theme.css');
require('resources/css/demo.css');

window.jsyaml=require("js-yaml");
require("yaml-js/yaml.js");
require("yaml-worker/index.js");
//require("app/bower_components/codemirror/lib/codemirror.js");
//require("app/bower_components/codemirror/mode/yaml/yaml.js");
//require("app/bower_components/codemirror/mode/xml/xml.js");
//require("app/bower_components/codemirror/mode/javascript/javascript.js");
window.CodeMirror = require("codemirror");
require("codemirror/mode/yaml/yaml.js");
require("codemirror/mode/xml/xml.js");
require("codemirror/mode/javascript/javascript.js");
require("jquery");
//require("app/bower_components/jquery-tmpl/jquery.tmpl.js");

require('bootstrap/dist/js/bootstrap.js');
require("resources/js/config.js");
require("resources/js/editor.js");
// require("src/morpho.js");
// require("src/visitor.js");
// require("src/modules/modYaml.js");
// require("src/modules/modCsdl.js");
// require("src/modules/modJson.js");
// require("src/modules/modSwagger.js");
// require("src/conventions/convAddDefaults.js");
require("index.js");

//require("./doc/samples/trippin.yaml");
require.context("./doc/samples", false, /.yaml$/);


