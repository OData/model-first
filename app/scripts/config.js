(function(){
  function getcmMode(format){
    // get CodeMirror mode for specific format
    switch(format){
      case 'csdl' :
        return 'xml';
      case 'json' :
        return {name: 'javascript', json: true};
      case 'yaml' :
        return 'yaml';
    }
  }

  window.morphoEditorConfig = {
    soruceFormats  : ['yaml'],
    targetFormats  : ['csdl', 'json'],
    formats                 : {
      'csdl'  : {
        displayName   : 'CSDL',
        cmMode        : getcmMode('csdl')
      },
      'json'  : {
        displayName   : 'JSON',
        cmMode        : getcmMode('json')
      },
      'yaml'  : {
        displayName   : 'YAML',
        cmMode        : getcmMode('yaml')
      }
    },

    samples       : 
    // sample
      ['sample.yaml', 'sample2.yaml']
    // endsample
  };
})();