'use strict';

var yaml=require('yaml-js/yaml.js').yaml;
var jsrender = require('jsrender');

$(function (){

  // Methods.
  function positionRangeForPath(yamlSpec, path) {
  var MAP_TAG = 'tag:yaml.org,2002:map';
  var SEQ_TAG = 'tag:yaml.org,2002:seq';
    // Type check
    if (typeof yamlSpec !== 'string') {
      throw new TypeError('yamlSpec should be a string');
    }
    if (!Array.isArray(path)) {
      throw new TypeError('path should be an array of strings');
    }

    var invalidRange = {
      start: {line: -1, column: -1},
      end: {line: -1, column: -1}
    };
    var i = 0;

    function compose(error, ast) {

      // simply walks the tree using current path recursively to the point that
      // path is empty.
      return find(ast);

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
          return invalidRange;
        }

        return {
          /* jshint camelcase: false */
          start: {
            line: current.start_mark.line,
            column: current.start_mark.column
          },
          end: {
            line: current.end_mark.line,
            column: current.end_mark.column
          }
        };
      }
    }

    return compose(null, yaml.compose(yamlSpec));
  }

  /*
  ** Convert sample to target format.
  ** @params:
  **    sourceArea: the source code mirror component.
  **    sourceFormat: the source format will be transformed.
  **    targetArea: the target code mirror component.
  **    targetFormat: the target format will transform to.
  */
  function convert(sourceArea, sourceFormat, targetArea, targetFormat){
    function displayError(errors)
    {
      $('#errors').empty();
      if(errors.length <= 0){
        $('#errPanel').addClass('sr-only');
        return;
      }

      $('#errPanel').removeClass('sr-only');
      for(var index in errors){
        var error={errorType:null,errDes:'',ln:0};

        error.errDes=!!( errors[index].description)? 
          errors[index].description: errors[index].message;

        if(errors[index].yamlError){
          error.errorType = 'Yaml Error';
          error.ln=errors[index].lineNumber;
        } else {
          error.errorType = 'Simple Yaml Error';
          var range = positionRangeForPath(input, errors[index].path);
          error.ln = range.start.line + 1;
        }
        console.log(error.errDes);
        var t = jsrender.templates('#errorTemp').render(error);
        console.log(t);
        $(t).appendTo('#errors');
      }
    }

    var defaultConfig = { addDefaults: true, format: true };
    var input = sourceArea.getValue();
    var out = Morpho.convert(input, sourceFormat, targetFormat, defaultConfig, displayError);

    targetArea.setValue(out.model);
  }

  /*
  ** Load the sample from server.
  */
  function loadSample(sampleName){
    $.get(samplesPrefix + sampleName, function(data){
      source.setValue(data);
      for(var i = 0; i < targets.length; i++){
        convert(source, config.soruceFormats[0], targets[i].target, targets[i].targetFormat);
      }
    });
  }

  /*
  ** Refresh the code mirror component.
  */
  function refreshCodeEditor(){
    // Location for the active label '<a />'.
    var active = $('#resultTabs > .active > a');

    // Using active.data('target') gets the value of the attribute data-target.
    // Then use the value of attribute data-target to get the element <div /> which contains the code editor.
    var resultContents = $(active.data('target'));

    var cmContainer = resultContents.find('.CodeMirror')[0];
    if(cmContainer && cmContainer.CodeMirror){
      cmContainer.CodeMirror.refresh();
    }
  }

  /*
  ** Remove the extension name from file's full name.
  ** @params:
  **     fileName: The full name of a file.
  */
  function removeFileExName(fileName){
    if(fileName){
      var index = fileName.lastIndexOf('.');
      return fileName.substring(0, index);
    }

    return fileName;
  }

  /*
  ** Capitalize the first letter in a string.
  ** @params:
  **     target: The target string need capitalize the first letter.
  */
  function capitalize(target){
    return target.charAt(0).toUpperCase() + target.substring(1, target.length);
  }

  /*
  ** Verify whether the collection contains the element.
  ** @params:
  **     collection: A collection.
  **     element: An element maybe contains in the collection.
  */
  function contains(collection, element){
    for(var i = 0; i < collection.length; i++){
      if(element === collection[i]){
        return true;
      }
    }

    return false;
  }

  /*
  ** Download the codes from the server.
  ** @params:
  **     yamlModel: The OData model is wrote with the simple yaml.
  **     url: The url which the code can be downloaded.
  */
  function download(yamlModel, url){
    var defaultConfig = { addDefaults: true, format: true };
    var jsonModel = Morpho.convert(yamlModel, config.soruceFormats[0], 'json', defaultConfig).model;
    $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json',
        data: jsonModel,
        success: function (result) {
            window.location.href = result.link;
        }
    });
  }

  // Initialize.
  var config  = window.morphoEditorConfig;
  var formats = config.formats;
  var source = CodeMirror.fromTextArea(document.getElementById('inputarea'), {
    mode: formats[config.soruceFormats[0]].cmMode,
    lineNumbers: true,
    theme: 'zenburn'
  });
  var samplesPrefix = 'samples/';
  var sampleList = $('#sampleList');
  $.each(config.samples, function(key, value) { 
    var val = removeFileExName(value);
    var li = '<li><a id="' + value + '" name="' + value + '" href="#">' + capitalize(val) + '</a></li>';
    sampleList.append(li); 
  });
  var targets = [];
  for(var i = 0; i < config.targetFormats.length; i++){
    console.log(config.targetFormats[i]);
    var tab = '<li id="' + config.targetFormats[i] + 'Tab"><a href="" data-target="#' + config.targetFormats[i] + '" data-toggle="tab">' + config.formats[config.targetFormats[i]].displayName + '</a></li>';
    var content = '<div class="tab-pane" id="' + config.targetFormats[i] + '"><textarea id="outputarea_' + config.targetFormats[i] + '"></textarea></div>';
    $('#resultTabs').append(tab);
    $('#resultContents').append(content);
    var target = CodeMirror.fromTextArea(document.getElementById('outputarea_' + config.targetFormats[i]), {
        mode: config.formats[config.targetFormats[i]].cmMode,
        readOnly: true,
        lineNumbers: true,
        theme: 'mdn-like'
    });
    targets.push({ target: target, targetFormat: config.targetFormats[i] });

    if(i === 0){
        $('#' + config.targetFormats[i] + 'Tab').addClass('active');
        $('#' + config.targetFormats[i]).addClass('active');
    }
  }

  loadSample(config.samples[0]);

  // All the events.
  // Trigger this event when the selector is changed.
  $('a').click(function(){
    if(contains(config.samples, $(this).attr('name'))){
      loadSample($(this).attr('name'));
      refreshCodeEditor();
    }

    var yamlModel = '';
    var downloadUrl = '';
    if($(this).attr('name') === 'csharpClient'){
      yamlModel = source.getValue();
      downloadUrl = 'http://localhost:9002/client/codegen?name=csharp';
      download(yamlModel, downloadUrl);
    }
    else if($(this).attr('name') === 'csharpServer'){
      yamlModel = source.getValue();
      downloadUrl = 'http://localhost:9002/server/codegen?name=csharp';
      download(yamlModel, downloadUrl);
    }
  });

  // Trigger this event when someone is editting in the input area.
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
    timer = window.setTimeout(function(){
      for(var i = 0; i < targets.length; i++){
        convert(source, config.soruceFormats[0], targets[i].target, targets[i].targetFormat);
      }
    }, 500);
  });

  // Trigger this event when the tab is changed.
  $('#resultTabs > li > a[data-toggle="tab"]').on('shown.bs.tab', function(e){
    if($(e.target).is(':visible')){
      refreshCodeEditor();
    }
  });
});
