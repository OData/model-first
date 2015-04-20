'use strict';

$(function (){
  function MorphoEditor(config){
    var source, target;
    var timer, flag = null;
    
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

    var configMap = [];

    this.loadSource = function(data){
      source.setValue(data);
      convert();
    };

    this.getConfig = function(key){
      return config[key];
    };

    this.setConfig = function(key, value){
      config[key] = value;
      if(configMap[key]){
        configMap[key]();
      }
    };
  }
  
  window.morphoEditor = new MorphoEditor(window.morphoEditorConfig);
});
