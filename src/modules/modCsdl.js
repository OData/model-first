// The CSDL module

function toCsdl()
{
  var str='';
  for(var i = 0, l = this.type.length; i < l; i++){
    str+=this.type[i];
  }

  return '<ComplexType Name="'+str+'" />';
}

this.Morpho.register('Csdl', null, toCsdl);

