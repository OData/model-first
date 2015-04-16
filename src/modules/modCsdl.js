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

function toCsdl()
{
  try {
    var str='';
    for(var i = 0, l = this.types.length; i < l; i++){
      var type = this.types[i];
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
    this.errors.push('Types is not declared.');
  }
}

this.Morpho.register('Csdl', null, toCsdl);

