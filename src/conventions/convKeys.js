function findKeys(model)
{
  if(!model.types) return;
  var keys = {};
  var visitor   = this.getVisitor();
  visitor.visitArr(model.types, function(obj){
    var keyList = [];
    visitor.visitArr(obj.properties, function(obj){
      if(obj.isKey){
        keyList.push(obj.name);
      }
    });
    keys[obj.name] = keyList;

    obj.keys=keyList;
  });

  return keys;
}

// Morpho.registerConvention('addKeys', findKeys);