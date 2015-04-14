function fromYaml(str){
  var obj       = yaml.load(str);
  console.log(obj.service);
  console.log(obj.service.name);
  this.service  = obj.service;
}

this.Morpho.register('Yaml', fromYaml, null);