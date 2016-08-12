//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

window.Morpho = {
  convertFrom   : {},
  convertTo     : {},
  conventions   : {},
  log           : function(){},
  registerFrom  : function(name, fromFunc){
    this.convertFrom[name] = fromFunc;
  },
  registerTo    : function(name, toFunc) {
    this.convertTo[name] = toFunc;
  },
  convert       : function(source, sourceFormat, targetFormat, option, callback){
    if(!Morpho.convertFrom[sourceFormat]){
      throw 'Source format ' + sourceFormat + ' not supported.';
    }

    if(!Morpho.convertTo[targetFormat]){
      throw 'Target format ' + targetFormat + ' not supported.';
    }

    var errors = [];
    var model = Morpho.convertFrom[sourceFormat].call(this, source, errors, option, callback);
    var result;
    if(model){
      result = Morpho.convertTo[targetFormat].call(this, model, errors, option);
    }

    return {
      model     : result,
      errors    : errors
    };
  },
};







