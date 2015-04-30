function fromYaml(str, errors){
  var obj;
  try {
    obj       = jsyaml.load(str);
  }
  catch(err) {
    errors.push({
      line: err.mark.line,
      message: err.reason
    });
    return null;
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
    if(str[str.length-1]===']'){
      str=str.substr(0,str.length-2);
    }

    return typeMap[str] || str || 'string';
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
      },
      'root'    : function(arr){
        var entitysets  = [];
        var singletons  = [];
        var operations  = [];
        
        this.visitArr(arr, function(item){
          if(!item.type){
            var operation = {};
            this.visitObj(item, {
              'name'    : function(obj){operation.name=obj;},
              'params'  : function(){
              },
              'returns' : function(){}
            });
            operations.push(operation);
            return;
          }

          // entityset or singleton
          var mt = getType(item.type);
          var et = {
            name : item.name,
            type : mt
          };
          
          if(item.type[item.type.length-1]===']'){
            entitysets.push(et);
          }else{
            singletons.push(et);
          }
        });

        state.container = {};
        if(entitysets.length>0)state.container.entitysets=entitysets;
        if(singletons.length>0)state.container.singletons=singletons;
        if(operations.length>0)state.container.operations=operations;
      }
  });

  return state;
}

Morpho.registerFrom('yaml', fromYaml);
