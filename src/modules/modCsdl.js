// The CSDL module

function toCsdl()
{
  var str='';
  for(var i = 0, l = this.types.length; i < l; i++){
    str+=this.types[i];
  }

  return '<ComplexType Name="'+str+'" />';
}

this.Morpho.register('Csdl', null, toCsdl);

