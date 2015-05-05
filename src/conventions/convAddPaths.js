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

Morpho.registerConvention('addPaths', addPaths);