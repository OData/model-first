'use strict';

describe('[YAML] Service section test', function() {
  var input='\
service:\n\
  name: Service0\n';

  it('Service name should match', function() {
    var model = Morpho.convertFrom.yaml.call(new Morpho(), input);
    expect(model.service.name).toEqual('Service0');
  });
});

describe('[YAML] Type section test', function() {
  it('Single property should work.',
    fromYamlTypeTest(
'\
types:\n\
  - name: type1\n\
    requiredProperties: p1\n',
      [{'properties':[{'name':'p1'}],'name':'type1'}]));

  it('Multiple property should work,using -.',
    fromYamlTypeTest(
'\
types:\n\
  - name: type1\n\
    requiredProperties:\n\
      - p1\n\
      - p3\n',
      [{'properties':[{'name':'p1'},{'name':'p3'}],'name':'type1'}]));

  it('Multiple property should work,using [].',
    fromYamlTypeTest(
'\
types:\n\
  - name: type1\n\
    requiredProperties: [p1, p3]\n',
      [{'properties':[{'name':'p1'},{'name':'p3'}],'name':'type1'}]));     

  it('Property with facets should work.',
    fromYamlTypeTest(
'\
types:\n\
  - name: type1\n\
    requiredProperties:\n\
      - name: p1\n\
        type: int\n',
      [{'properties':[{'name':'p1','type':'Int32'}],'name':'type1'}]));

  it('Combined Property case should work.',
    fromYamlTypeTest(
'\
types:\n\
  - name: type1\n\
    requiredProperties:\n\
      - name: p1\n\
        type: long\n\
      - p2',
      [{'properties':[{'name':'p1','type':'Int64'},{'name':'p2'}],'name':'type1'}]));      
});

describe('[YAML] Error test', function() {
  it('Error check', function() {
    var input='\
types:\n\
  - name: type1\n\
    requiredProperties:\n\
      -name: p1\n\
        type: long\n\
      - p2';
    var output = morpho.convert(input, 'yaml', 'json');
    expect(output.errors.length).toEqual(1);
    var error = output.errors[0];
    expect(error.line).toEqual(4);
    expect(error.message).toEqual('bad indentation of a mapping entry');
  });
});

function fromYamlTypeTest(input, types)
{
  return fromYamlTest(input, {'types':types});
}

var morpho = new Morpho(window.morphoTestConfig);
function fromYamlTest(input, json){
  return function(){
    var actual = morpho.convert(input, 'yaml', 'json');
    expect(actual.result).toEqual(JSON.stringify(json));
  };
}
