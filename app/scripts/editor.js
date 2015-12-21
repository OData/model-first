'use strict';

$(function (){
  function positionRangeForPath(yamlSpec, path, cb) {
  var MAP_TAG = 'tag:yaml.org,2002:map';
  var SEQ_TAG = 'tag:yaml.org,2002:seq';
    // Type check
    if (typeof yamlSpec !== 'string') {
      throw new TypeError('yamlSpec should be a string');
    }
    if (!Array.isArray(path)) {
      throw new TypeError('path should be an array of strings');
    }
    if (typeof cb !== 'function') {
      throw new TypeError('cb should be a function.');
    }

    var invalidRange = {
      start: {line: -1, column: -1},
      end: {line: -1, column: -1}
    };
    var i = 0;

    function compose(error, ast) {

      // simply walks the tree using current path recursively to the point that
      // path is empty.
      find(ast);

      function find(current) {
        if (current.tag === MAP_TAG) {
          for (i = 0; i < current.value.length; i++) {
            var pair = current.value[i];
            var key = pair[0];
            var value = pair[1];

            if (key.value === path[0]) {
              path.shift();
              return find(value);
            }
          }
        }

        if (current.tag === SEQ_TAG) {
          var item = current.value[path[0]];

          if (item && item.tag) {
            path.shift();
            return find(item);
          }
        }

        // if path is still not empty we were not able to find the node
        if (path.length) {
          return cb(invalidRange);
        }

        return cb({
          /* jshint camelcase: false */
          start: {
            line: current.start_mark.line,
            column: current.start_mark.column
          },
          end: {
            line: current.end_mark.line,
            column: current.end_mark.column
          }
        });
      }
    }

    compose(null, yaml.compose(yamlSpec));
  }

  function convert(){
    function displayError(errors)
    {
      $('#errors').empty();
      if(errors.length <= 0){return;}

      for(var index in errors){
        var error={errorType:null,errDes:'',ln:0};

        error.errDes=!!( errors[index].description)? 
          errors[index].description: errors[index].message;

        if(errors[index].yamlError){
          error.errorType = 'Yaml Error';
          error.ln=errors[index].lineNumber;
        } else {
          error.errorType = 'Simple Yaml Error';
          positionRangeForPath(input, errors[index].path,
            function(range){
            error.ln = range.start.line + 1;
          });
        }
        console.log(error.errDes);
        var t = $('#errorTemp').tmpl(error);
        console.log(t);
        t.appendTo('#errors');
      }
    }

    var defaultConfig = {addDefaults: true, format: true};
    var input = source.getValue();
    var out = Morpho.convert(input, config.sourceFormat, config.targetFormat, defaultConfig, displayError);

    target.setValue(out.model);
  }

  var config  = window.morphoEditorConfig;
  var formats = config.formats;
  config.sourceFormat = config.soruceFormat || config.soruceFormats[0];
  config.targetFormat = config.targetFormat || config.targetFormats[0];

  var source = CodeMirror.fromTextArea(document.getElementById('inputarea'), {
        mode: formats[config.sourceFormat].cmMode,
        lineNumbers: true
      }),
      target = CodeMirror.fromTextArea(document.getElementById('outputarea'), {
        mode: formats[config.targetFormat].cmMode,
        readOnly: true,
        lineNumbers: true
      });

  var timer = null;

  source.on('keyup', function(instance, evt) {
    switch (evt.keyCode) {
      //ignore up down left right 
      case 37:
      case 38:
      case 39:
      case 40:
        return;
    }

    window.clearTimeout(timer);
    timer = window.setTimeout(convert, 500);
  });

  window.MorphoEditor = {
    loadSource : function(data){
      source.setValue(data);
      convert();
    },
    getSamples : function(key){
      return window.morphoEditorConfig.samples;
    },
    setTargetFormat : function(format){
      target.setOption('mode', formats[format].cmMode);
      config.targetFormat = format;
      convert();
    }
  };
});
