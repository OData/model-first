//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

// JSON format representing the resource model.
// This is actually reflects the MorphoModel object.
(function(){
    function fromJson(jsonStr)
    {
      var obj       = JSON.parse(jsonStr);
      return obj;
    }

    function toJson(model, errors, option)
    {
      if(option.returnJSON){
        return model;
      }

      if(option.format){
        return JSON.stringify(model, null, 2);
      }

      return JSON.stringify(model);
    }

    Morpho.registerFrom('json', fromJson);
    Morpho.registerTo('json', toJson);
})();
