'use strict';

describe('[CONVENTION] Path', function() {
  it('Add Paths should work.', function() {
    var input = {
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

    expect('\n' + JSON.stringify(applyPath(input))).toEqual('\n' + JSON.stringify(expected));
  });
});

function applyPath(model){
  return Morpho.applyConvention(model, 'addPaths');
}
