function MorphoModel()
{
  this.service  = {};
  this.types    = {};
}

function Morpho(config)
{
  this.config = config || {};

  this.log = (function(enableLog){
    function nop(){}
    return enableLog ? console.log : nop;
  })(this.config.trace);
}


Morpho.convertFrom  = {};
Morpho.convertTo    = {};
Morpho.registerFrom = function(name, fromFunc){
  this.convertFrom[name] = fromFunc;
};

Morpho.registerTo    = function(name, toFunc) {
  this.convertTo[name] = toFunc;
};

Morpho.prototype.convert= function(source, sourceFormat, targetFormat){
  if(!Morpho.convertFrom[sourceFormat]){
    throw 'Source format ' + sourceFormat + ' not supported.';
  }

  var x = Morpho.convertFrom[sourceFormat].call(this, source);
  return Morpho.convertTo[targetFormat].call(this, x);
};





