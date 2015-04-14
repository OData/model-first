// The CSDL module

function toCsdl()
{
  try {
    var str='';
    for(var i = 0, l = this.types.length; i < l; i++){
      str+=this.types[i].name;
    }
    
    return '<ComplexType Name="'+str+'" />';
  }
  catch(err) {
  	this.errors.push('Types is not declared.');
  }
}

this.Morpho.register('Csdl', null, toCsdl);

