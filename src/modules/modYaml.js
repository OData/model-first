function fromYaml(str){
  var obj;
  try {
    obj       = yaml.load(str);
  }
  catch(err) {
    this.errors.push('Service is not declared.');
  }

  var typeMap =
  {
    'binary': 'Binary',
    'bool': 'Boolean',
    'byte': 'Byte',
    'date': 'Date',
    'dateTimeOffset': 'DateTimeOffset',
    'decimal': 'Decimal',
    'double': 'Double',
    'duration': 'Duration',
    'guid': 'Guid',
    'short': 'Int16',
    'int': 'Int32',
    'long': 'Int64',
    'sbyte': 'SByte',
    'single': 'Single',
    'stream': 'Stream',
    'string': 'String',
    'timeOfDay': 'TimeOfDay',
  };

  function getType(str)
  {
    return typeMap[str] || 'string';
  }

  var visitor   = this.getVisitor();
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
              if(property.type){
                property.type=getType(property.type);
              }
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

  return state;
}

Morpho.registerFrom('yaml', fromYaml);
