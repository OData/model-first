'use strict';

describe('[YAML] Service section test', function() {
  var input='\
service:\n\
  name: Service0\n';

  it('Service name should match', function() {
    var model = Morpho.convertFrom.yaml.call(Morpho, input, {}, {});
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

// Testing for operations
// 1. Testing for all kinds of actions.
describe('[YAML] Actions test', function(){
  var unboundActionWithYAML = '\
  root:\n\
    # Unbound Action\n\
    - name: actionTest\n\
      type: action\n\
      params:\n\
        - name: p1\n\
          type: int\n\
        - name: str1\n\
        - str2';
  var unboundActionWithJSON = 
  {
    'operations': [
      {
        'type': 'Action',
        'operationType': 'Unbound',
        'name': 'actionTest',
        'params': [
        {
          'name': 'p1',
          'type': 'Int32'
        },
        {
          'name': 'str1',
          'type': 'String'
        },
        {
          'name': 'str2',
          'type': 'String'
        }]
      }
    ]
  };
  
  it ('Unbound action without return types should work', fromYamlRootTest(unboundActionWithYAML, unboundActionWithJSON));

  unboundActionWithYAML = '\
  root:\n\
    # Unbound Action\n\
    - name: actionTest\n\
      type: action\n\
      params:\n\
        - name: p1\n\
          type: int\n\
        - name: str1\n\
        - str2\n\
      returns: int';
  unboundActionWithJSON = 
  {
    'operations': [
      {
        'type': 'Action',
        'operationType': 'Unbound',
        'name': 'actionTest',
        'params': [
        {
          'name': 'p1',
          'type': 'Int32'
        },
        {
          'name': 'str1',
          'type': 'String'
        },
        {
          'name': 'str2',
          'type': 'String'
        }],
        'returns': 'Int32'
      }
    ]
  };

  it ('Unbound action with a return type should work', fromYamlRootTest(unboundActionWithYAML, unboundActionWithJSON));

  var boundActionWithYAML = '\
  types:\n\
    - operations:\n\
        - name: actionTest\n\
          type: action\n\
          params:\n\
            - name: p1\n\
              type: int\n\
            - name: str1\n\
            - str2';
  var boundActionWithJSON = [
  {
    'properties': [
      {
        'name': 'actionTest',
        'type': 'Action',
        'params': [
        {
          'name': 'p1',
          'type': 'Int32'
        },
        {
          'name': 'str1',
          'type': 'String'
        },
        {
          'name': 'str2',
          'type': 'String'
        }],
        'operationType': 'Bound'
      }
    ]
  }];

  it ('Bound action without return types should work', fromYamlTypeTest(boundActionWithYAML, boundActionWithJSON));

  boundActionWithYAML = '\
  types:\n\
    - operations:\n\
        - name: actionTest\n\
          type: action\n\
          returns: int';
  boundActionWithJSON = [
  {
    'properties': [
      {
        'name': 'actionTest',
        'type': 'Action',
        'returns': 'Int32',
        'operationType': 'Bound'
      }
    ]
  }];

  it ('Bound action with a return type should work', fromYamlTypeTest(boundActionWithYAML, boundActionWithJSON));
});

// 2. Testing for all kinds of functions.
describe('[YAML] Functions test', function(){
  var unboundFunctionWithYAML = '\
  root:\n\
    - name: functionTest\n\
      type: function\n\
      params:\n\
        - name: friend\n\
          type: person';
  var unboundFunctionWithJSON = 
  {
    'operations': [
      {
        'type': 'Function',
        'operationType': 'Unbound',
        'name': 'functionTest',
        'params': [
        {
          'name': 'friend',
          'type': 'person'
        }]
      }
    ]
  };
  
  it ('Unbound function without return types should work', fromYamlRootTest(unboundFunctionWithYAML, unboundFunctionWithJSON));

  unboundFunctionWithYAML = '\
  root:\n\
    - name: functionTest\n\
      type: function\n\
      params:\n\
        - name: friend\n\
          type: person\n\
      returns: person[]';
  unboundFunctionWithJSON = 
  {
    'operations': [
      {
        'type': 'Function',
        'operationType': 'Unbound',
        'name': 'functionTest',
        'params': [
        {
          'name': 'friend',
          'type': 'person'
        }],
        'returns': 'person[]'
      }
    ]
  };

  it ('Unbound function with a return type should work', fromYamlRootTest(unboundFunctionWithYAML, unboundFunctionWithJSON));

  var boundFunctionWithYAML = '\
  types:\n\
    - operations:\n\
        - name: functionTest\n\
          type: function\n\
          params:\n\
            - name: id\n\
              type: int64';
  var boundFunctionWithJSON = [
  {
    'properties': [
      {
        'name': 'functionTest',
        'type': 'Function',
        'params': [
        {
          'name': 'id',
          'type': 'Int64'
        }],
        'operationType': 'Bound'
      }
    ]
  }];

  it ('Bound function without return types should work', fromYamlTypeTest(boundFunctionWithYAML, boundFunctionWithJSON));

  boundFunctionWithYAML = '\
  types:\n\
    - operations:\n\
        - name: functionTest\n\
          type: function\n\
          params:\n\
            - name: id\n\
              type: int64\n\
          returns: string';
  boundFunctionWithJSON = [
  {
    'properties': [
      {
        'name': 'functionTest',
        'type': 'Function',
        'params': [
        {
          'name': 'id',
          'type': 'Int64'
        }],
        'returns': 'String',
        'operationType': 'Bound'  
      }
    ]
  }];

  it ('Bound function with a return type should work', fromYamlTypeTest(boundFunctionWithYAML, boundFunctionWithJSON));
});

function fromYamlRootTest(input, root)
{
  return fromYamlTest(input, root, 'container');
}

function fromYamlTypeTest(input, types, addDefaults)
{
  return fromYamlTest(input, types, 'types', addDefaults);
}

function fromYamlTest(input, json, section, addDefaults){
  return function(){
    var actual = Morpho.convert(input, 'yaml', 'json', { addDefaults: addDefaults, returnJSON: true }).model;
    if(section) actual = actual[section];
    
    expect('\n'+JSON.stringify(actual)).toEqual('\n'+JSON.stringify(json));
  };
}
