(function(){
  function SwaggerType(type, format){
    this.type   = type;
    this.format = format;
  }

  var SwaggerTypes = {
    'integer'   : new SwaggerType('integer' , 'int32'   ),
    'long'      : new SwaggerType('integer' , 'int64'   ),
    'float'     : new SwaggerType('number'  , 'float'   ),
    'double'    : new SwaggerType('number'  , 'double'  ),
    'string'    : new SwaggerType('string'  , undefined ),
    'byte'      : new SwaggerType('string'  , 'byte'    ),
    'boolean'   : new SwaggerType('boolean' , undefined ),
    'date'      : new SwaggerType('string'  , 'date'    ),
    'dateTime'  : new SwaggerType('string'  , 'date-time'),
    'password'  : new SwaggerType('string'  , 'password'),
  };

  var typeMap = {
      'Binary'  : undefined,
      'Boolean' : SwaggerTypes.boolean,
      'Byte'    : SwaggerTypes.byte,
      'Date'    : SwaggerTypes.date,
      // 'DateTimeOffset': undefined,
      // 'Decimal' : undefined,
      'Double'  : SwaggerTypes.double,
      // 'Duration': 'Edm.Duration',
      // 'Guid': 'Edm.Guid',
      // 'Int16': 'Edm.Int16',
      'Int32'   : SwaggerTypes.integer,
      'Int64'   : SwaggerTypes.long,
      // 'SByte'   : 'Edm.SByte',
      'Single'  : SwaggerTypes.float,
      // 'Stream': 'Edm.Stream',
      'String'  : SwaggerTypes.string,
      // 'TimeOfDay': 'Edm.TimeOfDay',
    };

  function getSwaggerType(type){
    return typeMap[type] || SwaggerTypes.string;
  }

  Morpho.registerTo('swagger', function (model, errors, option){
    var visitor   = this.getVisitor();
    var state     = {
      'swagger'   : '2.0',
      'info'      : {
        'title'   : 'demo',
        'version' : '0.1'
      },
      'paths'     : {}
    };
    visitor.visitObj(model, {
        'types'   : function(arr){
          state.definitions = {};
          this.visitArr(arr, function(item){
            var type = {properties:{}};
            visitor.visitArr(item.properties, function(item){
              var swType = getSwaggerType(item.type);
              var propertyType = { type: swType.type};
              if(swType.format) propertyType.format= swType.format;
              type.properties[item.name] = propertyType;
            });

            state.definitions[item.name] = type;
          });
        }
      });


    if(option.returnJSON){
      return state;
    }else if(option.format){
      return JSON.stringify(state, null, 2);
    }

    return JSON.stringify(state);
  });
})();
