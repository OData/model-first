// JSON format representing the resource model.
// This is actually reflects the MorphoModel object.

(function(){
    function fromJson(jsonStr)
    {
      var obj       = JSON.parse(jsonStr);
      return obj;
    }

    function toJson(model)
    {
      return JSON.stringify(model);
    }

    Morpho.registerFrom('json', fromJson);
    Morpho.registerTo('json', toJson);
})();
