function MorphoModel(name, types)
{
  this.name     = name;
  this.types    = types;
  this.errors   = [];
}

this.Morpho = {
  register: function(name, fromFunc, toFunc){
    if(fromFunc){
      this['loadFrom' + name] = function(){
        var model = new MorphoModel();
        fromFunc.apply(model, arguments);
        return model;
      };
    }
    
    if(toFunc)
      MorphoModel.prototype['to' + name] = toFunc;
  }
};
