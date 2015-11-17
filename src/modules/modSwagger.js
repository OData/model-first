(function(){
  function SwaggerType(type, format){
    this.type   = type;
    if(format) this.format = format;
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
      var route = {
        'tags'        : [ type ],
        'description' : isCollection ?
            'Returns all items from ' + name + '.' :
            swKey ? 
              'Returns a single item from ' + name + '.' :
              'Returns ' + name + '.',
        'responses':{
          '200' : {
            'description' : isCollection ?
              'An array of ' + type + ' items.' :
              'A single ' + type + ' item.',
            'schema' : getSchema(type, isCollection)
          }
        }
      };

      if (swKey){
        var parameter = 
        {
            'name'        : swKey.name,
            'in'          : 'path',
            'description' : 'The key.',
            'required'    : true,
            'type'        : swKey.type,
        };
        if(swKey.format) parameter.format = swKey.format;

        route.parameters = [ parameter ];
      }

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
        var parameter = {
          'name'        : swKey.name,
          'in'          : 'path',
          'description' : 'The key.',
          'required'    : true,
          'type'        : swKey.type,
        };

        if(swKey.format) parameter.format = swKey.format;
        route.parameters.unshift(parameter);
      }

      return route;
    }

    function routeDelete(name, type, swKey){
      var parameter = {
        'name'        : swKey.name,
        'in'          : 'path',
        'description' : 'The key.',
        'required'    : true,
        'type'        : swKey.type,
      };
      if(swKey.format) parameter.format = swKey.format;

      return {
        'tags'        : [ type ],
        'description' : 'Delete an item from ' + name + '.',
        'parameters'  : [
          parameter,
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
          var routes = {};
          if(allows.read) routes.get = routeGet(item.name, item.type, true);
          if(allows.create) routes.post = routePost(item.name, item.type);
          paths['/' + item.name] = routes;

          var swKey = resolveKey(item.type);
          if(swKey){
            var sRoutes = {};
            if(allows.read) sRoutes.get = routeGet(item.name, item.type, false, swKey) ;
            if(allows.update) sRoutes.put = routePut(item.name, item.type, swKey);
            if(allows.delete) sRoutes.delete = routeDelete(item.name, item.type, swKey);
            paths['/' + item.name + '/{' + swKey.name + '}' ] = sRoutes;
          }
        });
      },
      'singletons'  : function(arr){
        visitor.visitArr(arr, function(item){
          var allows = genAllows(item.allows);
          var routes = {};
          if(allows.read) routes.get = routeGet(item.name, item.type, false);
          if(allows.update) routes.put = routePut(item.name, item.type);
          paths['/' + item.name] = routes;
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
        'service' : function(service){
          this.visitObj(service, {
            'name'  : function(name){
              state.info.title  = name;
            },
			'version' : function(version){
				if(version.current || version.current === 0)
					state.info.version = version.current;
				else
					state.info.version = version;
			},
			'termsOfService' : function(termsOfService){
				state.info.termsOfService = termsOfService;
			},
			'contact' : function(obj){
				state.info.contact= obj;
			},
			'license' : function(obj){
				state.info.license = obj;
			},
            'description' : function(description){
              state.info.description = description;
            },
            'host' : function(obj){
              state.host = obj;
            },
            'basePath' : function(obj){
              state.basePath = obj;
            }
          });
        },
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
                  // add paths would check whether format undefined.
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
