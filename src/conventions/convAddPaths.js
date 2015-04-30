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

        var path = {};
        var getRoute = {
          'responses':{
            '200' : {
              'schema' : getSchema(item.type, true)
            }
          }
        };

        path.get = getRoute;
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