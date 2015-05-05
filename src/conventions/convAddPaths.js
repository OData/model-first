function addPaths(model)
{
  function getSchema(type, isCollection){
    var sref= { '$ref': '#/definitions/' + type };

    return isCollection ? {'type'  : 'array', 'items' : sref} : sref;
  }

  if(!model.container) return;
  var paths= {};
  var visitor   = this.getVisitor();
  visitor.visitObj(model.container,{
    'entitysets'  : function(arr){
      visitor.visitArr(arr, function(item){
        var responseType = {};
        var schema = getSchema(item.type, true);
        var path = {};
        var getRoute = {
          'tags'        : [ item.type ],
          'description' : 'Returns all items from ' + item.name + '.',
          'responses':{
            '200' : {
              'description' : 'An array of ' + item.type + ' items.',
              'schema' : schema
            }
          }
        };

        path.get = getRoute;
        var singleSchema = getSchema(item.type, false);
        var postRoute= {
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
        path.post = postRoute;

        paths['/' + item.name] = path;
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