function MorphoModel(name, type)
{
  this.name = name;
  this.type = type;
}

MorphoModel.prototype.toCsdl = function()
{
  var str='';
  for(var i = 0, l = this.type.length; i < l; i++){
    str+=this.type[i];
  }

  return '<ComplexType Name="'+str+'" />';
};

this.Morpho = {
  loadFromYaml : function(str){
    return new MorphoModel('name', [str]);
  }
};
