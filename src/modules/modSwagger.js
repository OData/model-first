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
    // The follwing types are not defined in Swagger schema
    'decimal'   : new SwaggerType('number'  , 'decimal' ),
    'short'     : new SwaggerType('number'  , 'int16'   ),
  };

  var typeMap = {
      'Binary'  : undefined,
      'Boolean' : SwaggerTypes.boolean,
      'Byte'    : SwaggerTypes.byte,
      'Date'    : SwaggerTypes.date,
      // 'DateTimeOffset': undefined,
      'Decimal' : SwaggerTypes.decimal,
      'Double'  : SwaggerTypes.double,
      // 'Duration': 'Edm.Duration',
      // 'Guid': 'Edm.Guid',
      'Int16'   : SwaggerTypes.short,
      'Int32'   : SwaggerTypes.integer,
      'Int64'   : SwaggerTypes.long,
      // 'SByte'   : 'Edm.SByte',
      'Single'  : SwaggerTypes.float,
      // 'Stream': 'Edm.Stream',
      'String'  : SwaggerTypes.string,
      // 'TimeOfDay': 'Edm.TimeOfDay',
    };

  function getSwaggerType(type, isCollection){
    var sType = type === undefined  ?
                SwaggerTypes.string :
                typeMap[type] || {'$ref': '#/definitions/' + type};
    return isCollection ? {'type' : 'array', 'items' : sType } : sType;
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
              var swType = getSwaggerType(item.type, item.isCollection);
              var propertyType;
              if(swType.type){
                propertyType = { type: swType.type };
                if(swType.format) propertyType.format = swType.format;
                if(swType.items) propertyType.items = swType.items;
              }else{
                propertyType = swType;
              }

              type.properties[item.name] = propertyType;
            });

            state.definitions[item.name] = type;
          });
        }
      });

    var paths = Morpho.applyConvention(model, 'addPaths');
    state.paths=paths;

    if(option.returnJSON){
      return state;
    }else if(option.format){
      return JSON.stringify(state, null, 2);
    }

    return JSON.stringify(state);
  });
})();
