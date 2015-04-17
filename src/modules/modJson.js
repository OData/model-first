// JSON format representing the resource model.
// This is actually reflects the MorphoModel object.

(function(){
    function fromJson(jsonStr)
    {
      var obj       = JSON.parse(jsonStr);
      this.types    = obj.types;
      this.errors   = obj.errors;
    }

    function toJson()
    {
      return JSON.stringify(this);
    }

    this.Morpho.register('Json', fromJson, toJson);
})();