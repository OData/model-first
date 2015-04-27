'use strict';

$(function (){
  function convert(){
    var input = source.getValue();
    var out = new Morpho().convert(input, config.sourceFormat, config.targetFormat, {format: true});

    if(out.errors.length > 0){
      target.setValue('');
      $('#errors').val(JSON.stringify(out.errors[0]));
    }else{
      target.setValue(out.model);
      $('#errors').val('');
    }
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
