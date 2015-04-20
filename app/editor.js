'use strict';

$(editorInit);

var sourceEditor, targetEditor;

function convert() {
  var input = sourceEditor.getValue();
  var model = Morpho.loadFromYaml(input);

  if (valid(model)) {
    var res = model.toCsdl();
    if (valid(model)) {
      targetEditor.setValue(res);
    }
  }
}

function valid(model) {
  if (model.errors.length !== 0) {
    targetEditor.setValue(model.errors[0].toString());
    return false;
  }
  else {
    return true;
  }
}

function editorInit() {
  var timer, flag = null;
  
  sourceEditor = CodeMirror.fromTextArea(document.getElementById('inputarea'), {
    mode: 'yaml',
    lineNumbers: true
  });
  targetEditor = CodeMirror.fromTextArea(document.getElementById('outputarea'), {
    mode: 'xml',
    readOnly: true,
    lineNumbers: true
  });
  
  sourceEditor.on('keyup', function(instance, evt) {
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
};
