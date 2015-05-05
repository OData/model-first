'use strict';

describe('[YAML] Service section test', function() {
  var input='\
service:\n\
  name: Service0\n';

  it('Service name should match', function() {
    var model = Morpho.convertFrom.yaml.call(Morpho, input);
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

  it('Key and Nullable facets should work.',
    fromYamlTypeTest(
'\
types:\n\
  - name: type1\n\
    key: [s1, s2]\n\
    optionalProperties:\n\
      - name: p1\n\
        type: long\n',
      [{'properties':[
          {'name':'s1','isKey':true},
          {'name':'s2','isKey':true},
          {'name':'p1','type':'Int64','isNullable':true}
        ],
        'name':'type1'}
      ]));      
});

describe('[YAML] root section tests', function() {
  it ('EntitySet should work', fromYamlRootTest(
'\
root:\n\
  # Collection\n\
  - name: things\n\
    url: things # Optional\n\
    type: thing[]\n\
    allows: [read, create, update, delete, query, order, page] # Optional\n\
  # Singleton\n\
  - name: me\n\
    type: user\n\
  # Operation\n\
  - name: getFavoriteThings\n\
    params: # Optional\n\
      - name: userId\n\
        type: integer # Optional\n\
    returns: thing[] # Optional\n',
  {
    'entitysets':[{'name':'things','type':'thing'}],
    'singletons':[{'name':'me','type':'user'}],
    'operations':[{'name':'getFavoriteThings'}]
  }));
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
    var output = Morpho.convert(input, 'yaml', 'json');
    expect(output.errors.length).toEqual(1);
    var error = output.errors[0];
    expect(error.line).toEqual(4);
    expect(error.message).toEqual('bad indentation of a mapping entry');
  });
});

function fromYamlRootTest(input, root)
{
  return fromYamlTest(input, root, 'container');
}

function fromYamlTypeTest(input, types)
{
  return fromYamlTest(input, types, 'types');
}

function fromYamlTest(input, json, section){
  return function(){
    var actual = Morpho.convert(input, 'yaml', 'json', {returnJSON:true}).model;
    if(section){
      actual = actual[section];
    }
    expect('\n'+JSON.stringify(actual)).toEqual('\n'+JSON.stringify(json));
  };
}
