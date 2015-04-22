'use strict';

$(function (){
  var source, target;
    
  function convert(){
    var input = source.getValue();
    var model = Morpho.loadFromYaml(input);

    if (valid(model)) {
      var res = model.toCsdl();
      if (valid(model)) {
        target.setValue(res);
      }
    }
  }

  function valid(model) {
    if (model.errors.length !== 0) {
      target.setValue(model.errors[0].toString());
      return false;
    }
    else {
      return true;
    }
  }

  source = CodeMirror.fromTextArea(document.getElementById('inputarea'), {
    mode: 'yaml',
    lineNumbers: true
  });
  target = CodeMirror.fromTextArea(document.getElementById('outputarea'), {
    mode: 'xml',
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

  window.MorphoEditor = {
    loadSource : function(data){
      source.setValue(data);
      convert();
    },
    getSamples : function(key){
      return window.morphoEditorConfig.samples;
    },
    setTargetFormat : function(format){
      target.setOption('mode', 'javascript');
    }
  };
});
