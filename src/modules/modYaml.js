function fromYaml(str){
  var obj;
  try {
    obj       = yaml.load(str);
  }
  catch(err) {
    this.errors.push('Service is not declared.');
  }
  
  var visitor   = new Visitor();
  var state     = {};
  visitor.visitObj(obj, {
      'service' : function(obj){ state.service  = obj; },
      'types'   : function(arr){
        state.types = [];
        this.visitArr(arr, function(item){
          function handleProperty(obj){
            var property;
            if( typeof obj === 'string' ){
              property = {
                'name': obj
              };
            }else{
              property = obj;
            }
            
            return property;
          }
        
        
          var type={properties:[]};
          this.visitObj(item, {
            'name'  : function(obj){ type.name = obj; },
            'key'   : function(obj){
                        this.visitArr(obj, function(obj){
                          var property = handleProperty(obj);
                          type.properties.push(property);
                        });
                      },
            'requiredProperties'   : 
                      function(obj){
                          this.visitArr(obj, function(obj){
                            var property = handleProperty(obj);
                            type.properties.push(property);
                          });
                       }
          });
          state.types.push(type);
        });
      }
  });
  
  this.service  = state.service;
  this.types    = state.types;

}

this.Morpho.register('Yaml', fromYaml, null);