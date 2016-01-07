'use strict';

describe('[Swagger] Primitive type definitions test', function(){
    it('Predefined types in module should work well', function(){
        var jsonModel = {
        'types': [
        {
            'properties': [
            {
                'name': 'prop1',
                'type': 'edm.binary'
            },
            {
                'name': 'prop2',
                'type': 'edm.boolean'
            },
            {
                'name': 'prop3',
                'type': 'edm.byte'
            },
            {
                'name': 'prop4',
                'type': 'edm.date'
            },
            {
                'name': 'prop5',
                'type': 'edm.datetimeoffset'
            },
            {
                'name': 'prop6',
                'type': 'edm.decimal'
            },
            {
                'name': 'prop7',
                'type': 'edm.double'
            },
            {
                'name': 'prop8',
                'type': 'edm.duration'
            },
            {
                'name': 'prop9',
                'type': 'edm.guid'
            },
            {
                'name': 'prop10',
                'type': 'edm.int16'
            },
            {
                'name': 'prop11',
                'type': 'edm.int32'
            },
            {
                'name': 'prop12',
                'type': 'edm.int64'
            },
            {
                'name': 'prop13',
                'type': 'edm.sbyte'
            },
            {
                'name': 'prop14',
                'type': 'edm.single'
            },
            {
                'name': 'prop15',
                'type': 'edm.stream'
            },
            {
                'name': 'prop16',
                'type': 'edm.string'
            },
            {
                'name': 'prop17',
                'type': 'edm.timeofday'
            },
            {
                'name': 'prop18',
                'type': 'edm.geography'
            },
            {
                'name': 'prop19',
                'type': 'edm.geographypoint'
            },
            {
                'name': 'prop20',
                'type': 'edm.geographylinestring'
            },
            {
                'name': 'prop21',
                'type': 'edm.geographypolygon'
            },
            {
                'name': 'prop22',
                'type': 'edm.geographymultipoint'
            },
            {
                'name': 'prop23',
                'type': 'edm.geographymultilinestring'
            },
            {
                'name': 'prop24',
                'type': 'edm.geographymultipolygon'
            },
            {
                'name': 'prop25',
                'type': 'edm.geographycollection'
            },
            {
                'name': 'prop26',
                'type': 'edm.geometry'
            },
            {
                'name': 'prop27',
                'type': 'edm.geometrypoint'
            },
            {
                'name': 'prop28',
                'type': 'edm.geometrylinestring'
            },
            {
                'name': 'prop29',
                'type': 'edm.geometrypolygon'
            },
            {
                'name': 'prop30',
                'type': 'edm.geometrymultipoint'
            },
            {
                'name': 'prop31',
                'type': 'edm.geometrymultilinestring'
            },
            {
                'name': 'prop32',
                'type': 'edm.geometrymultipolygon'
            },
            {
                'name': 'prop33',
                'type': 'edm.geometrycollection'
            }],
            'name': 'myType'
        }]
    };
    var swaggerModel = {
        'myType': {
            'properties': {
                'prop1': { 'type': 'string', 'format': 'binary' },
                'prop2': { 'type': 'boolean' },
                'prop3': { 'type': 'string', 'format': 'byte' },
                'prop4': { 'type': 'string', 'format': 'date' },
                'prop5': { 'type': 'string', 'format': 'string' },
                'prop6': { 'type': 'number', 'format': 'decimal' },
                'prop7': { 'type': 'number', 'format': 'double' },
                'prop8': { 'type': 'string', 'format': 'string' },
                'prop9': { 'type': 'string', 'format': 'string' },
                'prop10': { 'type': 'integer', 'format': 'int16' },
                'prop11': { 'type': 'integer', 'format': 'int32' },
                'prop12': { 'type': 'integer', 'format': 'int64' },
                'prop13': { 'type': 'integer', 'format': 'sbyte' },
                'prop14': { 'type': 'number', 'format': 'float' },
                'prop15': { 'type': 'string', 'format': 'string' },
                'prop16': { 'type': 'string' },
                'prop17': { 'type': 'string', 'format': 'string' },
                'prop18': { 'type': 'string', 'format': 'string' },
                'prop19': { 'type': 'string', 'format': 'string' },
                'prop20': { 'type': 'string', 'format': 'string' },
                'prop21': { 'type': 'string', 'format': 'string' },
                'prop22': { 'type': 'string', 'format': 'string' },
                'prop23': { 'type': 'string', 'format': 'string' },
                'prop24': { 'type': 'string', 'format': 'string' },
                'prop25': { 'type': 'string', 'format': 'string' },
                'prop26': { 'type': 'string', 'format': 'string' },
                'prop27': { 'type': 'string', 'format': 'string' },
                'prop28': { 'type': 'string', 'format': 'string' },
                'prop29': { 'type': 'string', 'format': 'string' },
                'prop30': { 'type': 'string', 'format': 'string' },
                'prop31': { 'type': 'string', 'format': 'string' },
                'prop32': { 'type': 'string', 'format': 'string' },
                'prop33': { 'type': 'string', 'format': 'string' }
            }
        }
    };

    assertDefinition(jsonModel, swaggerModel);
    });
});

describe('[Swagger] To Swagger test', function () {
    it('service should work.', function () {
        var jsonModel =
        {
            'service': {
                'name': 'service1',
                'version': '0.1',
                'description': 'this is service1',
                'host': 'var1.org',
                'basePath': '/ab/(S(cnbm44wtbc1v5bgrlek5lpcc))/dat'
            }
        };

        var info = {
            'title': 'service1',
            'version': '0.1',
            'description': 'this is service1'
        };

        var sw = toSwagger(jsonModel, undefined, true);
        expect('\n' + JSON.stringify(sw.info)).toEqual('\n' + JSON.stringify(info));
        expect('\n' + JSON.stringify(sw.info.title)).toEqual('\n' + '"service1"');
        expect('\n' + JSON.stringify(sw.info.version)).toEqual('\n' + '"0.1"');
        expect('\n' + JSON.stringify(sw.host)).toEqual('\n' + '"var1.org"');
        expect('\n' + JSON.stringify(sw.basePath)).toEqual('\n' + '"/ab/(S(cnbm44wtbc1v5bgrlek5lpcc))/dat"');
    });
    it('Info object related service fields should match', function () {
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

        var expected = {
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

    it('Definitions of enum should work.', function () {
        var jsonModel =
        {
            'types': [
                {
                    'name': 'oringialColors',
                    'members': [
                        {
                            'name': 'red'
                        },
                        {
                            'name': 'yellow'
                        },
                        {
                            'name': 'blue'
                        }
                    ]
                },
                {
                    'name': 'personGender',
                    'members': [
                        {
                            'name': 'unknown',
                            'value': 0
                        },
                        {
                            'name': 'female',
                            'value': -1
                        },
                        {
                            'name': 'male',
                            'value': 2
                        }
                    ],
                    'flags': false,
                    'underlyingType': 'edm.int32'
                },
                {
                    'name': 'Book',
                    'properties': [
                        {
                            'name': 'id',
                            'type': 'edm.int64'
                        },
                        {
                            'name': 'title',
                            'type': 'edm.string',
                        },
                        {
                            'name': 'keywords',
                            'type': 'edm.string',
                            'isCollection': true
                        },
                        {
                            'name': 'author',
                            'type': 'person',
                            'isCollection': false
                        },
                    ]
                }
            ]
        };

        var expected = {
            'oringialColors': {
                'type': 'string',
                'enum': [
                    'red',
                    'yellow',
                    'blue'
                ]
            },
            'personGender': {
                'type': 'string',
                'enum': [
                    'unknown',
                    'female',
                    'male'
                ]
            },
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
                        'type': 'array',
                        'items': {
                            'type': 'string'
                        }
                    },
                    'author': {
                        '$ref': '#/definitions/person'
                    }
                }
            }
        };

        assertDefinition(jsonModel, expected);
    });

    it('Definitions collection properties should work.', function () {
        var jsonModel =
        {
            'types': [
                {
                    'name': 'Book',
                    'properties': [
                        {
                            'name': 'id',
                            'type': 'edm.int64'
                        },
                        {
                            'name': 'title',
                            'type': 'edm.string',
                        },
                        {
                            'name': 'day',
                            'type': 'edm.date',
                            'isCollection': false
                        },
                        {
                            'name': 'keywords',
                            'type': 'edm.string',
                            'isCollection': true
                        },
                        {
                            'name': 'author',
                            'type': 'person',
                            'isCollection': false
                        },
                        {
                            'name': 'reader',
                            'type': 'person',
                            'isCollection': true
                        }
                    ]
                }
            ]
        };

        var expected = {
            'Book': {
                'properties': {
                    'id': {
                        'type': 'integer',
                        'format': 'int64'
                    },
                    'title': {
                        'type': 'string'
                    },
                    'day': {
                        'type': 'string',
                        'format': 'date'
                    },
                    'keywords': {
                        'type': 'array',
                        'items': {
                            'type': 'string'
                        }
                    },
                    'author': {
                        '$ref': '#/definitions/person'
                    },
                    'reader': {
                        'type': 'array',
                        'items': {
                            //'type': 'person',  //?
                            '$ref': '#/definitions/person'
                        }
                    }
                }
            }
        };

        assertDefinition(jsonModel, expected);
    });

    it('Allows should work.', function () {
        var input = {
            'types': [
                {
                    'properties': [
                        {
                            'name': 'uid',
                            'type': 'edm.string',
                            'isKey': true
                        },
                        {
                            'name': 'title',
                            'type': 'edm.string',
                            'isKey': true
                        }
                    ],
                    'name': 'book'
                }
            ],
            'container': {
                'entitysets': [{'name': 'books', 'type': 'book', 'allows': ['create', 'delete']}],
                'singletons': [{'name': 'me', 'type': 'user', 'allows': ['update']}],
            }
        };

        var expected = {
            '/books': {
                'post': {
                    'tags': ['book'],
                    'description': 'Adds a new book to books.',
                    'parameters': [{
                        'name': 'book',
                        'in': 'body',
                        'description': 'The new book item.',
                        'required': true,
                        'schema': {'$ref': '#/definitions/book'}
                    }],
                    'responses': {
                        '201': {
                            'description': 'The newly added book item.',
                            'schema': {'$ref': '#/definitions/book'}
                        }
                    }
                }
            },
            '/books/{uid}': {
                'delete': {
                    'tags': ['book'],
                    'description': 'Delete an item from books.',
                    'parameters': [{
                        'name': 'uid',
                        'in': 'path',
                        'description': 'The key.',
                        'required': true,
                        'type': 'string'
                    },
                        {
                            'name': 'If-Match',
                            'in': 'header',
                            'description': 'If-Match header.',
                            'type': 'string'
                        }
                    ],
                    'responses': {
                        '204': {
                            'description': 'Successful.'
                        }
                    }
                }
            },
            '/me': {
                'put': {
                    'tags': ['user'],
                    'description': 'Update me.',
                    'parameters': [
                        {
                            'name': 'user',
                            'in': 'body',
                            'description': 'The new user item.',
                            'required': true,
                            'schema': {'$ref': '#/definitions/user'}
                        },
                        {
                            'name': 'If-Match',
                            'in': 'header',
                            'description': 'If-Match header.',
                            'type': 'string'
                        }
                    ],
                    'responses': {
                        '204': {
                            'description': 'Successful.'
                        }
                    }
                },
            }
        };

        assertPaths(input, expected);
    });

    it('Add Paths should work.', function () {
        var input = {
            'types': [
                {
                    'properties': [
                        {
                            'name': 'uid',
                            'type': 'edm.string',
                            'isKey': true
                        },
                        {
                            'name': 'title',
                            'type': 'edm.string',
                            'isKey': true
                        }
                    ],
                    'name': 'book'
                }
            ],
            'container': {
                'entitysets': [{'name': 'books', 'type': 'book', 'allows': ['read', 'create', 'update', 'delete']}],
                'singletons': [{'name': 'me', 'type': 'user', 'allows': ['read', 'update']}],
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
                    'tags': ['book'],
                    'description': 'Adds a new book to books.',
                    'parameters': [{
                        'name': 'book',
                        'in': 'body',
                        'description': 'The new book item.',
                        'required': true,
                        'schema': {'$ref': '#/definitions/book'}
                    }],
                    'responses': {
                        '201': {
                            'description': 'The newly added book item.',
                            'schema': {'$ref': '#/definitions/book'}
                        }
                    }
                }
            },
            '/books/{uid}': {
                'get': {
                    'tags': ['book'],
                    'description': 'Returns a single item from books.',
                    'responses': {
                        '200': {
                            'description': 'A single book item.',
                            'schema': {'$ref': '#/definitions/book'}
                        }
                    },
                    'parameters': [{
                        'name': 'uid',
                        'in': 'path',
                        'description': 'The key.',
                        'required': true,
                        'type': 'string'
                    }]
                },
                'put': {
                    'tags': ['book'],
                    'description': 'Update an existing book item.',
                    'parameters': [{
                        'name': 'uid',
                        'in': 'path',
                        'description': 'The key.',
                        'required': true,
                        'type': 'string'
                    },
                        {
                            'name': 'book',
                            'in': 'body',
                            'description': 'The new book item.',
                            'required': true,
                            'schema': {'$ref': '#/definitions/book'}
                        },
                        {
                            'name': 'If-Match',
                            'in': 'header',
                            'description': 'If-Match header.',
                            'type': 'string'
                        }
                    ],
                    'responses': {
                        '204': {
                            'description': 'Successful.'
                        }
                    }
                },
                'delete': {
                    'tags': ['book'],
                    'description': 'Delete an item from books.',
                    'parameters': [{
                        'name': 'uid',
                        'in': 'path',
                        'description': 'The key.',
                        'required': true,
                        'type': 'string'
                    },
                        {
                            'name': 'If-Match',
                            'in': 'header',
                            'description': 'If-Match header.',
                            'type': 'string'
                        }
                    ],
                    'responses': {
                        '204': {
                            'description': 'Successful.'
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
                            'schema': {'$ref': '#/definitions/user'}
                        }
                    }
                },
                'put': {
                    'tags': ['user'],
                    'description': 'Update me.',
                    'parameters': [
                        {
                            'name': 'user',
                            'in': 'body',
                            'description': 'The new user item.',
                            'required': true,
                            'schema': {'$ref': '#/definitions/user'}
                        },
                        {
                            'name': 'If-Match',
                            'in': 'header',
                            'description': 'If-Match header.',
                            'type': 'string'
                        }
                    ],
                    'responses': {
                        '204': {
                            'description': 'Successful.'
                        }
                    }
                },
            }
        };

        assertPaths(input, expected);
    });
});

// Testing for operations
// 1. Testing for all kinds of actions.
describe('[Swagger] Actions test', function () {
    it('Unbound action should work.', function () {
        var input =
        {
            'container': {
                'operations': [
                    {
                        'type': 'Action',
                        'operationType': 'Unbound',
                        'name': 'actionTest',
                        'params': [
                            {
                                'name': 'p1',
                                'type': 'edm.int32'
                            }]
                    }]
            }
        };

        var expected =
        {
            '/actionTest': {
                'post': {
                    'tags': [
                        'Action',
                        'Unbound'
                    ],
                    'description': 'Unbound action: actionTest.',
                    'parameters': [
                        {
                            'name': 'If-Match',
                            'type': 'string',
                            'in': 'header',
                            'description': 'The If-Match header.',
                            'required': false
                        },
                        {
                            'name': 'p1',
                            'type': 'integer',
                            'in': 'formData',
                            'description': 'The parameter.',
                            'required': true,
                            'format': 'int32'
                        }
                    ],
                    'responses': {
                        '201': {
                            'description': 'The action has been created new entities.'
                        },
                        '204': {
                            'description': 'The action is without a return type.'
                        }
                    }
                }
            }
        };

        assertPaths(input, expected);
    });

    it('Bound action should work.', function () {
        var input =
        {
            'container': {
                'entitysets': [
                    {
                        'name': 'people',
                        'type': 'person',
                        'allows': [
                            'read'
                        ]
                    }
                ]
            },
            'types': [
                {
                    'properties': [
                        {
                            'name': 'userName',
                            'type': 'edm.string',
                            'isKey': true
                        },
                        {
                            'name': 'actionTest',
                            'type': 'Action',
                            'operationType': 'Bound'
                        }
                    ],
                    'name': 'person'
                }
            ]
        };

        var expected = {
            '/people': {
                'get': {
                    'tags': [
                        'person'
                    ],
                    'description': 'Returns all items from people.',
                    'responses': {
                        '200': {
                            'description': 'An array of person items.',
                            'schema': {
                                'type': 'array',
                                'items': {
                                    '$ref': '#/definitions/person'
                                }
                            }
                        }
                    }
                }
            },
            '/people/{userName}': {
                'get': {
                    'tags': [
                        'person'
                    ],
                    'description': 'Returns a single item from people.',
                    'responses': {
                        '200': {
                            'description': 'A single person item.',
                            'schema': {
                                '$ref': '#/definitions/person'
                            }
                        }
                    },
                    'parameters': [
                        {
                            'name': 'userName',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true,
                            'type': 'string'
                        }
                    ]
                }
            },
            '/people/{userName}/actionTest': {
                'post': {
                    'tags': [
                        'Action',
                        'Bound'
                    ],
                    'description': 'Bound action: actionTest.',
                    'parameters': [
                        {
                            'name': 'If-Match',
                            'type': 'string',
                            'in': 'header',
                            'description': 'The If-Match header.',
                            'required': false
                        },
                        {
                            'name': 'userName',
                            'type': 'string',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true
                        }
                    ],
                    'responses': {
                        '201': {
                            'description': 'The action has been created new entities.'
                        },
                        '204': {
                            'description': 'The action is without a return type.'
                        }
                    }
                }
            }
        };

        assertPaths(input, expected);
    });
});

// 2. Testing for all kinds of functions.
describe('[Swagger] Functions test', function () {
    it('Unbound function should work.', function () {
        var input =
        {
            'container': {
                'operations': [
                    {
                        'type': 'Function',
                        'operationType': 'Unbound',
                        'name': 'functionTest',
                        'params': [
                            {
                                'name': 'p1',
                                'type': 'edm.int32'
                            }
                        ],
                        'returns': 'edm.int32'
                    }]
            }
        };

        var expected = {
            '/functionTest': {
                'get': {
                    'tags': [
                        'Function',
                        'Unbound'
                    ],
                    'description': 'Unbound function: functionTest.',
                    'parameters': [
                        {
                            'name': 'p1',
                            'type': 'integer',
                            'in': 'formData',
                            'description': 'The parameter.',
                            'required': true,
                            'format': 'int32'
                        }
                    ],
                    'responses': {
                        '204': {
                            'description': 'The function is without a return type.'
                        },
                        '400': {
                            'description': 'A single entity function with a non-nullable return type has no result.'
                        },
                        '200': {
                            'description': 'The function has been returned results.',
                            'schema': {
                                'type': 'integer',
                                'format': 'int32'
                            }
                        }
                    }
                }
            }
        };

        assertPaths(input, expected);
    });

    it('Bound function should work.', function () {
        var input =
        {
            'container': {
                'entitysets': [
                    {
                        'name': 'people',
                        'type': 'person',
                        'allows': [
                            'read'
                        ]
                    }
                ]
            },
            'types': [
                {
                    'properties': [
                        {
                            'name': 'userName',
                            'type': 'edm.string',
                            'isKey': true
                        },
                        {
                            'name': 'functionTest',
                            'type': 'Function',
                            'operationType': 'Bound'
                        }
                    ],
                    'name': 'person'
                }
            ]
        };

        var expected = {
            '/people': {
                'get': {
                    'tags': [
                        'person'
                    ],
                    'description': 'Returns all items from people.',
                    'responses': {
                        '200': {
                            'description': 'An array of person items.',
                            'schema': {
                                'type': 'array',
                                'items': {
                                    '$ref': '#/definitions/person'
                                }
                            }
                        }
                    }
                }
            },
            '/people/{userName}': {
                'get': {
                    'tags': [
                        'person'
                    ],
                    'description': 'Returns a single item from people.',
                    'responses': {
                        '200': {
                            'description': 'A single person item.',
                            'schema': {
                                '$ref': '#/definitions/person'
                            }
                        }
                    },
                    'parameters': [
                        {
                            'name': 'userName',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true,
                            'type': 'string'
                        }
                    ]
                }
            },
            '/people/{userName}/functionTest': {
                'get': {
                    'tags': [
                        'Function',
                        'Bound'
                    ],
                    'description': 'Bound function: functionTest.',
                    'parameters': [
                        {
                            'name': 'userName',
                            'type': 'string',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true
                        }
                    ],
                    'responses': {
                        '204': {
                            'description': 'The function is without a return type.'
                        },
                        '400': {
                            'description': 'A single entity function with a non-nullable return type has no result.'
                        }
                    }
                }
            }
        };
        assertPaths(input, expected);
    });
});

function assertDefinition(input, output) {
    expect('\n' + toSwagger(input, 'definitions')).toEqual('\n' + JSON.stringify(output));
}

function assertPaths(input, output) {
    expect('\n' + toSwagger(input, 'paths')).toEqual('\n' + JSON.stringify(output));
}

function assertService(input, output) {
    expect('\n' + toSwagger(input, 'info')).toEqual('\n' + JSON.stringify(output));
}

function toSwagger(input, section, returnJson) {
    var result = Morpho.convertTo.swagger.call(Morpho, input, {}, {returnJSON: true});
    if (section) {
        result = result[section];
    }

    return returnJson ? result : JSON.stringify(result);
}
