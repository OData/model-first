Morpho.addDefaults = function(model)
{
  var visitor = new Visitor();
  visitor.visitObj(model, {
    'types' : function(obj){
      visitor.visitArr(obj, function(obj){
        visitor.visitObj(obj,{
          'properties' : function(properties){
            visitor.visitArr(properties, function(property){
              if(!property.type){
                property.type = 'String';
              }
            });
          }
        });
      });
    },
    'container'  : function(obj){
      //allows: [read, create, update, delete]
      function updateCol(el){

      }

      visitor.visitObj(obj,{
        'entitysets'  : function(entitysets){
          visitor.visitArr(entitysets, function(entityset){
            if(!entityset.allows) entityset.allows = ['read'];
          });
        }
      });
    }
  });
};
