function addPaths(model)
{
  function getSchema(type, isCollection){
    var sref= { '$ref': '#/definitions/' + type };

    return isCollection ? {'type'  : 'array', 'items' : sref} : sref;
  }


  this.log('addPaths begin');
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
          'responses':{
            '200' : {
              'description' : 'Get the ' + item.name,
              'schema' : schema
            }
          }
        };

        path.get = getRoute;
        var singleSchema = getSchema(item.type, false);
        var postRoute= {
          "description": "Post a new entity to EntitySet" + item.name,
          "parameters": [
            {
              "name": item.type,
              "in": "body",
              "description": "The entity to post",
              "schema": singleSchema
            }
          ],
          "responses": {
            "201": {
              "description": "EntitySet " + item.name,
              "schema": singleSchema
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