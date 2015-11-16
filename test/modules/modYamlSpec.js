'use strict';

describe('[YAML] Service section test', function() {
  var input='\
service:\n\
  name: Service0\n\
  version: 3';

  it('Service name should match', function() {
    var model = Morpho.convertFrom.yaml.call(Morpho, input, {}, {});
    expect(model.service.name).toEqual('Service0');
  });
  
  it('Service version without current format should match', function() {
    var model = Morpho.convertFrom.yaml.call(Morpho, input, {}, {});
    expect(model.service.version).toEqual(3);
  });
  
  it('Service info object fields should match', 
    fromYamlServiceTest(
	'service:\n\
  name: TripPin OData Reference Service\n\
  version:\n\
    current: 1.2.3\n\
  description: TripPin is a fictional reference service demonstrating the capabilities of OData v4.\n\
  termsOfService: http://swagger.io/terms/\n\
  contact:\n\
    name: API Support\n\
    url: http://www.swagger.io/support\n\
    email: support@swagger.io\n\
  license:\n\
    name: Apache 2.0\n\
    url: http://www.apache.org/licenses/LICENSE-2.0.html',
	{
    'name': 'TripPin OData Reference Service',
    'version': {
      'current': '1.2.3'
    },
    'description': 'TripPin is a fictional reference service demonstrating the capabilities of OData v4.',
    'termsOfService': 'http://swagger.io/terms/',
    'contact': {
      'name': 'API Support',
      'url': 'http://www.swagger.io/support',
      'email': 'support@swagger.io'
    },
    'license': {
      'name': 'Apache 2.0',
      'url': 'http://www.apache.org/licenses/LICENSE-2.0.html'
	}
    })
  );
});

describe('[YAML] Type section test', function() {

  it('Enum with values should work',
    fromYamlTypeTest(
'\
types:\n\
  - name: personGender\n\
    members:\n\
      - name: unknown\n\
        value: 0\n\
      - name: female\n\
        value: -1\n\
      - name: male\n\
        value: 2\n\
    flags: false\n\
    underlyingType: int32',
      [{'name': 'personGender', 'members': [{'name': 'unknown', 'value': 0}, {'name': 'female', 'value': -1}, {'name': 'male', 'value': 2}], 'flags': false, 'underlyingType': 'int32'}]));	

  it('Enum without values should work',
    fromYamlTypeTest(
'\
types:\n\
  - name: personGender\n\
    members: [unknown, female, male]',
      [{'name': 'personGender', 'members': [{'name': 'unknown'}, {'name': 'female'}, {'name': 'male'}]}]));
	  
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

  it('Combined Property case should work, default type should be set.',
    fromYamlTypeTest(
'\
types:\n\
  - name: type1\n\
    requiredProperties:\n\
      - name: p1\n\
        type: long\n\
      - p2',
      [{'properties':[
        {'name':'p1','type':'Int64'},
        {'name':'p2','type':'String'}
      ],'name':'type1'}],
      true));      

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
    'entitysets':[{
      'name':'things',
      'type':'thing',
      'allows':['read', 'create', 'update', 'delete', 'query', 'order', 'page']}],
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

function fromYamlTypeTest(input, types, addDefaults)
{
  return fromYamlTest(input, types, 'types', addDefaults);
}

function fromYamlServiceTest(input, service, addDefaults)
{
  return fromYamlTest(input, service, 'service', addDefaults);
}

function fromYamlTest(input, json, section, addDefaults){
  return function(){
    var actual = Morpho.convert(input, 'yaml', 'json', {addDefaults:addDefaults, returnJSON:true}).model;
    if(section) actual = actual[section];
    
    expect('\n'+JSON.stringify(actual)).toEqual('\n'+JSON.stringify(json));
  };
}
