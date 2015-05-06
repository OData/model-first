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
    'guid'      : new SwaggerType('string'  , 'guid'    )
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
      'Guid'    : SwaggerTypes.guid,
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

  function addPaths(model, resolveKey)
  {
    function getSchema(type, isCollection){
      var sref= { '$ref': '#/definitions/' + type };

      return isCollection ? {'type'  : 'array', 'items' : sref} : sref;
    }

    if(!model.container) return;

    var paths= {};
    var visitor   = new Visitor();
    visitor.visitObj(model.container,{
      'entitysets'  : function(arr){
        visitor.visitArr(arr, function(item){
          var responseType = {};
          var schema = getSchema(item.type, true);
          var path = {};

          path.get = {
            'tags'        : [ item.type ],
            'description' : 'Returns all items from ' + item.name + '.',
            'responses':{
              '200' : {
                'description' : 'An array of ' + item.type + ' items.',
                'schema' : schema
              }
            }
          };

          var singleSchema = getSchema(item.type, false);
          path.post = {
            'tags'        : [ item.type ],
            'description' : 'Adds a new ' + item.type + ' to ' + item.name + '.',
            'parameters'  : [
              {
                'name'        : item.type,
                'in'          : 'body',
                'description' : 'The new ' + item.type + ' item.',
                'required'    : true,
                'schema'      : singleSchema
              }
            ],
            'responses': {
              '201': {
                'description' : 'The newly added ' + item.type + ' item.',
                'schema'      : singleSchema
              },
            }
          };

          paths['/' + item.name] = path;

          var swKey = resolveKey(item.type);
          if(swKey){
            spath = {};
            var key = swKey.name;

            spath.put = {
              'tags'        : [ item.type ],
              'description' : 'Update an existing ' + item.type + ' item.',
              'parameters'  : [
                {
                  'name'        : key,
                  'in'          : 'path',
                  'description' : 'The key.',
                  'required'    : true,
                  'type'        : swKey.type,
                  'format'      : swKey.format
                },
                {
                  'name'        : item.type,
                  'in'          : 'body',
                  'description' : 'The new ' + item.type + ' item.',
                  'required'    : true,
                  'schema'      : singleSchema
                }
              ],
              'responses': {
                '204': {
                  'description' : 'Successful.'
                },
              }
            };

            paths['/' + item.name + '/{' + key + '}' ] = spath;
          }
        });
      },
      'singletons'  : function(arr){
        visitor.visitArr(arr, function(item){
          var responseType = {};
          var path = {};
          var getRoute = {
            'responses':{
              '200' : {
                'description' : 'Get the ' + item.name,
                'schema' : getSchema(item.type, false)
              }
            }
          };

          path.get = getRoute;
          paths['/' + item.name] = path;
        });
      },
    });

    return paths;
  }


  Morpho.registerTo('swagger', function (model, errors, option){
    var visitor   = this.getVisitor();
    var state     = {
      'swagger'   : '2.0',
      'info'      : {
        'title'   : 'Demo',
        'version' : '0.1'
      },
      'paths'     : {}
    };

    var keys = {};

    visitor.visitObj(model, {
        'types'   : function(arr){
          state.definitions = {};
          this.visitArr(arr, function(item){
            var type = {properties:{}};
            var keyProperty = null;
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

              if(!keyProperty && item.isKey){
                keyProperty = {
                  'name'  : item.name,
                  'type'  : swType.type,
                  'format': swType.format
                };
              }
            });

            if(keyProperty){
              keys[item.name] = keyProperty;
            }

            state.definitions[item.name] = type;
          });
        }
      });

    state.paths = addPaths(model, function(type){
      return keys[type];
    });
    

    if(option.returnJSON){
      return state;
    }else if(option.format){
      return JSON.stringify(state, null, 2);
    }

    return JSON.stringify(state);
  });
})();
