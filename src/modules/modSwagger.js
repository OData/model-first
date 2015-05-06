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
    'guid'      : new SwaggerType('string'  , 'guid'    ),
    'dateTimeOffset'      : new SwaggerType('string'  , 'dateTimeOffset'    ),
    'duration'  : new SwaggerType('string'  , 'duration'),
  };

  var typeMap = {
      'Binary'  : undefined,
      'Boolean' : SwaggerTypes.boolean,
      'Byte'    : SwaggerTypes.byte,
      'Date'    : SwaggerTypes.date,
      'DateTimeOffset': SwaggerTypes.dateTimeOffset,
      'Decimal' : SwaggerTypes.decimal,
      'Double'  : SwaggerTypes.double,
      'Duration': SwaggerTypes.duration,
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
                typeMap[type];

    if(!sType){
      if(type.length>4 && type.slice(0,4) === 'edm.'){
        sType = new SwaggerType('string', type);
      }else{
        sType = {'$ref': '#/definitions/' + type};
      }
    }

    return isCollection ? {'type' : 'array', 'items' : sType } : sType;
  }

  function addPaths(model, resolveKey)
  {
    function getSchema(type, isCollection){
      var sref= { '$ref': '#/definitions/' + type };
      return isCollection ? {'type'  : 'array', 'items' : sref} : sref;
    }

    function routeGet(name, type, isCollection, swKey){
      var parameters;

      if (swKey){
        parameters = [
          {
            'name'        : swKey.name,
            'in'          : 'path',
            'description' : 'The key.',
            'required'    : true,
            'type'        : swKey.type,
            'format'      : swKey.format
          }
        ];
      }

      var route = {
        'tags'        : [ type ],
        'description' : isCollection ?
            'Returns all items from ' + name + '.' :
            swKey ? 
              'Returns a single item from ' + name + '.' :
              'Returns ' + name + '.',
        'parameters'  : parameters,
        'responses':{
          '200' : {
            'description' : isCollection ?
              'An array of ' + type + ' items.' :
              'A single ' + type + ' item.',
            'schema' : getSchema(type, isCollection)
          }
        }
      };

      return route;
    }

    function routePost(name, type){
      var singleSchema = getSchema(type, false);
      return {
        'tags'        : [ type ],
        'description' : 'Adds a new ' + type + ' to ' + name + '.',
        'parameters'  : [
          {
            'name'        : type,
            'in'          : 'body',
            'description' : 'The new ' + type + ' item.',
            'required'    : true,
            'schema'      : singleSchema
          }
        ],
        'responses': {
          '201': {
            'description' : 'The newly added ' + type + ' item.',
            'schema'      : singleSchema
          },
        }
      };
    }

    function routePut(name, type, swKey){
      var route = {
        'tags'        : [ type ],
        'description' : swKey ?
          'Update an existing ' + type + ' item.' :
          'Update ' + name + '.',
        'parameters'  : [
          {
            'name'        : type,
            'in'          : 'body',
            'description' : 'The new ' + type + ' item.',
            'required'    : true,
            'schema'      : getSchema(type, false)
          },
          {
            'name': 'If-Match',
            'in': 'header',
            'description': 'If-Match header.',
            'type': 'string'
          }
        ],
        'responses': {
          '204': {
            'description' : 'Successful.'
          },
        }
      };

      if(swKey){
        route.parameters.unshift({
            'name'        : swKey.name,
            'in'          : 'path',
            'description' : 'The key.',
            'required'    : true,
            'type'        : swKey.type,
            'format'      : swKey.format
          });
      }

      return route;
    }

    function routeDelete(name, type, swKey){
      return {
        'tags'        : [ type ],
        'description' : 'Delete an item from ' + name + '.',
        'parameters'  : [
          {
            'name'        : swKey.name,
            'in'          : 'path',
            'description' : 'The key.',
            'required'    : true,
            'type'        : swKey.type,
            'format'      : swKey.format
          },
          {
            'name': 'If-Match',
            'in': 'header',
            'description': 'If-Match header.',
            'type': 'string'
          }
        ],
        'responses': {
          '204': {
            'description' : 'Successful.'
          },
        }
      };
    }

    function genAllows(allows){
      if(!allows) return {'read' : true};

      var ac = {};
      for(var i = 0; i < allows.length; i++){
        ac[allows[i]] = true;
      }

      return ac;
    }

    if(!model.container) return;

    var paths= {};
    var visitor   = new Visitor();
    
    visitor.visitObj(model.container,{
      'entitysets'  : function(arr){
        visitor.visitArr(arr, function(item){
          var allows = genAllows(item.allows);
          paths['/' + item.name] = {
            'get'   : allows.read    ? routeGet(item.name, item.type, true) : undefined,
            'post'  : allows.create  ? routePost(item.name, item.type)      : undefined
          };

          var singleSchema = getSchema(item.type, false);
          var swKey = resolveKey(item.type);
          if(swKey){
            paths['/' + item.name + '/{' + swKey.name + '}' ] = {
              'get'   : allows.read    ? routeGet(item.name, item.type, false, swKey)  : undefined,
              'put'   : allows.update  ? routePut(item.name, item.type, swKey)         : undefined,
              'delete': allows.delete  ? routeDelete(item.name, item.type, swKey)      : undefined,
            };
          }
        });
      },
      'singletons'  : function(arr){
        visitor.visitArr(arr, function(item){
          var allows = genAllows(item.allows);
          paths['/' + item.name] = {
            'get' : allows.read    ? routeGet(item.name, item.type, false) : undefined,
            'put' : allows.update  ? routePut(item.name, item.type)        : undefined,
          };
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
