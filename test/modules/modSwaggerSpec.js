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

  xit('Add Paths should work.', function() {
    var input = {
      'types' : [
        {
          'properties': [
            {
              'name': 'uid',
              'isKey': true
            },
            {
              'name': 'title',
              'isKey': true
            }
          ],
          'name': 'book'
        }
      ],     
      'container' : {
        'entitysets':[{'name':'books','type':'book'}],
        //'singletons':[{'name':'me','type':'user'}],
        //'operations':[{'name':'getFavoriteThings'}]
      }
    };

    var expected = {
      '/books': {
        'get': {
          'tags': ['book'],
          'description': 'Returns all items from books.',
          'responses': {
            '200': {
              'description': 'An array of book items.',
              'schema': {
                'type': 'array',
                'items': {
                  '$ref': '#/definitions/book'
                }
              }
            }
          }
        },
        'post': {
          'tags':['book'],
          'description':'Adds a new book to books.',
          'parameters':[{
            'name':'book',
            'in':'body',
            'description':'The new book item.',
            'required':true,
            'schema':{'$ref':'#/definitions/book'}}],
          'responses':{
            '201':{
              'description':'The newly added book item.',
              'schema':{'$ref':'#/definitions/book'}
            }
          }
        }
      }
    };

    assertPaths(input, expected);
  });
});

function assertDefinition(input, output){
  expect('\n' + toSwagger(input, 'definitions')).toEqual('\n' + JSON.stringify(output));
}

function assertPaths(input, output){
  expect('\n' + toSwagger(input, 'paths')).toEqual('\n' + JSON.stringify(output));
}

function toSwagger(input, section){
  var result = Morpho.convertTo.swagger.call(Morpho, input, {}, {returnJSON:true});
  if(section){
    result = result[section];
  }

  return JSON.stringify(result);
}
