function MorphoModel()
{
  this.service  = {};
  this.types    = {};
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

this.Logger = {
  getLogger: function(level){
    var nop = function(){};
  
    var debugLogger = {
      debug   : console.log,
      info    : console.info
    };
    
    var infoLogger = {
      debug   : nop,
      info    : console.info
    };
    
    if(level == 'debug')
      return debugLogger;
    else
      return infoLogger;
  }
};

this.logger = this.Logger.getLogger('debugA');

function Visitor()
{
  this._level   = 0;
  this._prefix  = '';
}

Visitor.prototype.log=function()
{
  var args = Array.prototype.slice.call(arguments); 
  args.unshift(this._prefix);
  logger.debug.apply(null, args);
};

Visitor.prototype.increaseLevel=function(){
  ++this._level;
  this._prefix+='|';
};

Visitor.prototype.decreaseLevel=function(){
  --this._level;
  this._prefix=this._prefix.substring(1);
};

Visitor.prototype.visitWrap=function(func)
{
  this.increaseLevel();
  this.log('-- Visiting Begin');
  func.call(this);
  this.log('-- Visiting End');
  this.decreaseLevel();
};

Visitor.prototype.visitObj=function(obj, map)
{
  this.log(JSON.stringify(obj));
  this.visitWrap(function(){
    for(var i in obj) {
      if (obj.hasOwnProperty(i)) {
        this.log('Node:', i);
        if(map[i]){
          map[i].call(this, obj[i]);
        }
      }
    }
  });
};

Visitor.prototype.visitArr=function(arr, func)
{
  var na = [].concat(arr);
  this.visitWrap(function(){
    for(var i in na) {
      this.log('Arr',i,na[i]);
      func.call(this, na[i]);
    }
  });
};
