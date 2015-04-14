function fromYaml(str){
  try {
    var obj       = yaml.load(str);
    console.log(obj.service);
    console.log(obj.service.name);
    this.service  = obj.service;
    this.types = obj.types;
  }
  catch(err) {
  	this.errors.push('Service is not declared.');
  }
}

this.Morpho.register('Yaml', fromYaml, null);