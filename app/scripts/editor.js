'use strict';

$(function (){
  var config = window.morphoEditorConfig;

  var source, target;
    
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

  source = CodeMirror.fromTextArea(document.getElementById('inputarea'), {
    mode: getcmStr(config.sourceFormat),
    lineNumbers: true
  });
  target = CodeMirror.fromTextArea(document.getElementById('outputarea'), {
    mode: getcmStr(config.targetFormat),
    readOnly: true,
    lineNumbers: true
  });
  
  source.on('keyup', function(instance, evt) {
    switch (evt.keyCode) {
      //ignore up down left right 
      case 37:
      case 38:
      case 39:
      case 40:
        return;
    }

    var timer, flag = null;
  
    window.clearTimeout(timer);
    timer = setTimeout(convert, 500);
    if (flag === null) {
      flag = true;
    }
    else {
      if (flag === true) {
        window.clearTimeout(timer);
        timer = window.setTimeout(convert, 500);
      }
    }
  });

  function getcmStr(format){
    switch(format){
      case 'csdl' :
        return 'xml';
      case 'json' :
        return {name: 'javascript', json: true};
    }
  }

  window.MorphoEditor = {
    loadSource : function(data){
      source.setValue(data);
      convert();
    },
    getSamples : function(key){
      return window.morphoEditorConfig.samples;
    },
    setTargetFormat : function(format){
      target.setOption('mode', getcmStr(format));
      config.targetFormat = format;
      convert();
      console.log(target.getOption('mode'));
    }
  };
});
