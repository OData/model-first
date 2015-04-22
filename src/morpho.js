function MorphoModel()
{
  this.service  = {};
  this.types    = {};
}

function MorphoNG()
{

}

this.MorphoNG.prototype.convert = function(sourceData, sourceFormat, targetFormat){

};

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

this.config = this.config || {};

this.log = (function(enableLog){
  function nop(){}
  return enableLog ? console.log : nop;
})(this.config.trace);

