'use strict';

window.runEdit = function runEdit() {
  var source, result, timer, flag = null;
  function convert() {
    var input = source.getValue();
    var model = Morpho.loadFromYaml(input);
	if (valid(model)) {
	  var res = model.toCsdl();
	  if (valid(model)) {
		result.setValue(res);
	  }
	}
  }
  
  function valid(model) {
	if (model.errors.length !== 0) {
      result.setValue(model.errors[0].toString());
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
  
  result = CodeMirror.fromTextArea(document.getElementById('outputarea'), {
    mode: 'xml',
    readOnly: true,
	lineNumbers: true
  });
  
  var defaultInput='\
service:\n\
  name: Service\n\
types:\n\
  - name: Book\n\
    requiredProperties:\n\
      - Title\n\
      - Author\n\
  - name: Blog\n\
    key:\n\
      - name: ID\n\
        type: string\n\
    requiredProperties: Title\n';
  source.setValue(defaultInput);
  convert();
};