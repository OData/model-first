//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

// The CSDL module

var typeMap = 
{
  'Binary': 'Edm.Binary',
  'Boolean': 'Edm.Boolean',
  'Byte': 'Edm.Byte',
  'Date': 'Edm.Date',
  'DateTimeOffset': 'Edm.DateTimeOffset',
  'Decimal': 'Edm.Decimal',
  'Double': 'Edm.Double',
  'Duration': 'Edm.Duration',
  'Guid': 'Edm.Guid',
  'Int16': 'Edm.Int16',
  'Int32': 'Edm.Int32',
  'Int64': 'Edm.Int64',
  'SByte': 'Edm.SByte',
  'Single': 'Edm.Single',
  'Stream': 'Edm.Stream',
  'String': 'Edm.String',
  'TimeOfDay': 'Edm.TimeOfDay',
};

function getEdmType(str)
{
  return typeMap[str] || 'Edm.String';
}

function toCsdl(model, errors)
{
  try {
  var str='';
  for(var i = 0, l = model.types.length; i < l; i++){
    var type = model.types[i];
    var typeStr='<ComplexType Name="'+type.name;
    if(type.properties.length>0){
      typeStr+='">\n';
      for(var j = 0, pl = type.properties.length; j < pl; j++){
        var property = type.properties[j];
        typeStr+='  <Property Name="'+ property.name +'" Type="'+getEdmType(property.type)+'"/>\n';
      }
      typeStr+='</ComplexType>\n';
    }else{
      typeStr+='" />\n';
    }
    str+=typeStr;
  }

  return str;
  }
  catch(err) {
    errors.push({
      message: 'Types is not declared.'
    });
  }
}

Morpho.registerTo('csdl', toCsdl);
