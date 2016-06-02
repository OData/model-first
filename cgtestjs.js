'use strict';

require('codemirror/lib/codemirror.css');
require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/css/bootstrap-theme.css');


require("jquery");
require('bootstrap/dist/js/bootstrap.js');

require("codemirror/mode/javascript/javascript.js");
require("codemirror/mode/clike/clike.js");
window.CodeMirror = require("codemirror");

require("resources/js/codeeditor");
require.context("./resources/test samples", false, /.json$/);