'use strict';

describe('[CONVENTION] To CSDL test', function() {
  xit('Empty complex type should work.', function() {
    var input = {
      'container' : {
        'entitysets':[{'name':'things','type':'thing'}],
        //'singletons':[{'name':'me','type':'user'}],
        //'operations':[{'name':'getFavoriteThings'}]
      }
    };

    var expected = {
      '/things': {
        'get': {
          //"description": "d1",
          'responses': {
            '200': {
              //"description": "d2.",
              'schema': {
                'type': 'array',
                'items': {
                  '$ref': '#/definitions/thing'
                }
              }
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
