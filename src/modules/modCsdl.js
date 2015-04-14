// The CSDL module

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
          typeStr+='  <Property Name="'+ type.properties[j] +'" Type="Edm.String"/>\n';
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

