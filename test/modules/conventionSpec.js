'use strict';

xdescribe('[CONVENTION] Path', function() {
  it('Add Paths should work.', function() {
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

    expect('\n' + JSON.stringify(applyPath(input))).toEqual('\n' + JSON.stringify(expected));
  });
});

describe('[CONVENTION] Key', function() {
  xit('Add Key should work.', function() {
    var input = {
      'types': [
        {
          'properties': [
            {
              'name': 'ID',
              'isKey': true
            },
            {
              'name': 'name',
              'isKey': true
            }
          ],
          'name': 'Person'
        }
      ]
    };

    var expected = { 'Person' : ['ID','name']};

    expect('\n' + JSON.stringify(applyAddKeys(input))).toEqual('\n' + JSON.stringify(expected));
  });
});

function applyAddKeys(model){
  return Morpho.applyConvention(model, 'addKeys');
}

function applyPath(model){
  return addPaths(model, function(t){return t;});
}
