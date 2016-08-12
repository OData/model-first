//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

Morpho.getVisitor = function(){
  return new Visitor();
};

function Visitor()
{
  this._level   = 0;
  this._prefix  = '';
  this._log     = Morpho.log;
}

Visitor.prototype.log=function()
{
  var args = Array.prototype.slice.call(arguments); 
  args[0] = this._prefix + args[0];
  this._log.apply(null, args);
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
  this.log('<--');
  func.call(this);
  this.log('-->');
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
      this.log('Arr['+i+']:'+ JSON.stringify(na[i]));
      func.call(this, na[i]);
    }
  });
};

module.exports = Visitor;
