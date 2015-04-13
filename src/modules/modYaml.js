function fromYaml(str){
  this.name = 'name';
  this.type = [str];
}

this.Morpho.register('Yaml', fromYaml, null);