'use strict';

describe('[Swagger] To Swagger test', function() {
  it('Definitions should work.', function() {
    var jsonModel = 
      {
        'types':
        [
          {
            'name'        : 'Book',
            'properties'  : 
            [
              {
                'name'    : 'id',
                'type'    : 'Int64'
              },
              {
                'name'    : 'title',
                //'type'    : 'String',
              },
              {
                'name'    : 'keywords',
                'type'    : 'String',
                'isCollection' : true
              },
              {
                'name'    : 'author',
                'type'    : 'person',
                'isCollection' : false
              },
            ]
          }
        ]
      };

    Morpho.applyConvention(jsonModel, 'defaultType');

    var expected  = {
      'Book': {
        'properties': {
          'id': {
            'type': 'integer',
            'format': 'int64'
          },
          'title': {
            'type': 'string'
          },
          'keywords': {
            'type'  : 'array',
            'items' : {
              'type': 'string'
            }
          },
          'author': {
            '$ref'  :'#/definitions/person'
          }
        }
      }
    };

    assertDefinition(jsonModel, expected);
  });
});


function assertDefinition(input, output){
  expect('\n' + toSwagger(input, 'definitions')).toEqual('\n' + JSON.stringify(output));
}

function toSwagger(input, section){
  var result = Morpho.convertTo.swagger.call(Morpho, input, {}, {returnJSON:true});
  if(section){
    result = result[section];
  }

  return JSON.stringify(result);
}
