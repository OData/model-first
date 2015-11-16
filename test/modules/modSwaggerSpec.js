'use strict';

describe('[Swagger] To Swagger test', function() {
  it('service should work.', function() {
    var jsonModel = 
      {
        'service':{
          'name' : 'service1',
		  'version' : '0.1',
          'description' : 'this is service1',
          'host': 'var1.org',
          'basePath': '/ab/(S(cnbm44wtbc1v5bgrlek5lpcc))/dat'
        }
      };

    var info  = {
      'title'       : 'service1',
      'version'     : '0.1',
      'description' : 'this is service1'
    };

    var sw = toSwagger(jsonModel, undefined, true);
    expect('\n' + JSON.stringify(sw.info)).toEqual('\n' + JSON.stringify(info));
    expect('\n' + JSON.stringify(sw.host)).toEqual('\n' + '"var1.org"');
    expect('\n' + JSON.stringify(sw.basePath)).toEqual('\n' + '"/ab/(S(cnbm44wtbc1v5bgrlek5lpcc))/dat"');
  });

  it('Info object related service fields should match', function() {
    var jsonModel = 
      {
		'service': {
		  'name': 'TripPin OData Reference Service',
          'version': {
            'current': '1.0.0'
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
          },
	    }
	  };

    var expected  = {
		'title': 'TripPin OData Reference Service',
		'version': '1.0.0',
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
	};

    assertService(jsonModel, expected);
  });
  
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

  it('Allows should work.', function() {
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
        'entitysets':[{'name':'books','type':'book','allows':['create','delete']}],
        'singletons':[{'name':'me','type':'user','allows':['update']}],
      }
    };

    var expected = {
      '/books': {
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
      },
      '/books/{uid}': {
        'delete': {
          'tags': ['book'],
          'description': 'Delete an item from books.',
          'parameters':[{
            'name':'uid',
            'in':'path',
            'description':'The key.',
            'required':true,
            'type':'string'
          },
          {
            'name':'If-Match',
            'in':'header',
            'description':'If-Match header.',
            'type':'string'
          }
          ],
          'responses':{
            '204':{
              'description':'Successful.'
            }
          }
        }
      },
      '/me': {
        'put': {
          'tags': ['user'],
          'description': 'Update me.',
          'parameters':[
            {
              'name':'user',
              'in':'body',
              'description':'The new user item.',
              'required':true,
              'schema':{'$ref':'#/definitions/user'}
            },
            {
              'name': 'If-Match',
              'in': 'header',
              'description': 'If-Match header.',
              'type': 'string'
            }
          ],
          'responses':{
            '204':{
              'description':'Successful.'
            }
          }
        },
      }
    };

    assertPaths(input, expected);
  });

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
        'entitysets':[{'name':'books','type':'book','allows':['read','create','update','delete']}],
        'singletons':[{'name':'me','type':'user','allows':['read','update']}],
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
      },
      '/books/{uid}': {
        'get': {
          'tags': ['book'],
          'description': 'Returns a single item from books.',
          'responses':{
            '200': {
              'description': 'A single book item.',
              'schema':{'$ref':'#/definitions/book'}
            }
          },
          'parameters':[{
            'name':'uid',
            'in':'path',
            'description':'The key.',
            'required':true,
            'type':'string'
          }]
        },
        'put': {
          'tags': ['book'],
          'description': 'Update an existing book item.',
          'parameters':[{
              'name':'uid',
              'in':'path',
              'description':'The key.',
              'required':true,
              'type':'string'
            },
            {
              'name':'book',
              'in':'body',
              'description':'The new book item.',
              'required':true,
              'schema':{'$ref':'#/definitions/book'}
            },
            {
              'name': 'If-Match',
              'in': 'header',
              'description': 'If-Match header.',
              'type': 'string'
            }
          ],
          'responses':{
            '204':{
              'description':'Successful.'
            }
          }
        },
        'delete': {
          'tags': ['book'],
          'description': 'Delete an item from books.',
          'parameters':[{
            'name':'uid',
            'in':'path',
            'description':'The key.',
            'required':true,
            'type':'string'
          },
          {
            'name':'If-Match',
            'in':'header',
            'description':'If-Match header.',
            'type':'string'
          }
          ],
          'responses':{
            '204':{
              'description':'Successful.'
            }
          }
        }
      },
      '/me': {
        'get': {
          'tags': ['user'],
          'description': 'Returns me.',
          'responses': {
            '200': {
              'description': 'A single user item.',
              'schema': { '$ref': '#/definitions/user' }
            }
          }
        },
        'put': {
          'tags': ['user'],
          'description': 'Update me.',
          'parameters':[
            {
              'name':'user',
              'in':'body',
              'description':'The new user item.',
              'required':true,
              'schema':{'$ref':'#/definitions/user'}
            },
            {
              'name': 'If-Match',
              'in': 'header',
              'description': 'If-Match header.',
              'type': 'string'
            }
          ],
          'responses':{
            '204':{
              'description':'Successful.'
            }
          }
        },
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

function assertService(input, output){
  expect('\n' + toSwagger(input, 'info')).toEqual('\n' + JSON.stringify(output));
}

function toSwagger(input, section, returnJson){
  var result = Morpho.convertTo.swagger.call(Morpho, input, {}, {returnJSON:true});
  if(section){
    result = result[section];
  }

  return returnJson ? result : JSON.stringify(result);
}
