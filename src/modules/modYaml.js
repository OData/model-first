function fromYaml(str){
  try {
    var obj       = yaml.load(str);
    var visitor   = new Visitor();
    var state     = {};
    visitor.visitObj(obj, {
        'service' : function(obj){ state.service  = obj; },
        'types'   : function(arr){
          state.types = [];
          this.visitArr(arr, function(item){
            var type={properties:[]};
            this.visitObj(item, {
              'name'  : function(obj){ type.name = obj; },
              'key'   : function(obj){ type.properties.push(obj); },
              'requiredProperties'   : function(obj){ type.properties.push(obj); }
            });
            state.types.push(type);
          });
        }
    });
   
  
    this.service  = state.service;
    this.types    = state.types;
  }
  catch(err) {
    this.errors.push('Service is not declared.');
  }
}

this.Morpho.register('Yaml', fromYaml, null);