//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

'use strict';

describe('[Swagger] Primitive type definitions test', function () {
    it('Predefined types in module should work well', function () {
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
                    'prop1': {'type': 'string', 'format': 'binary'},
                    'prop2': {'type': 'boolean'},
                    'prop3': {'type': 'string', 'format': 'byte'},
                    'prop4': {'type': 'string', 'format': 'date'},
                    'prop5': {'type': 'string', 'format': 'string'},
                    'prop6': {'type': 'number', 'format': 'decimal'},
                    'prop7': {'type': 'number', 'format': 'double'},
                    'prop8': {'type': 'string', 'format': 'string'},
                    'prop9': {'type': 'string', 'format': 'string'},
                    'prop10': {'type': 'integer', 'format': 'int16'},
                    'prop11': {'type': 'integer', 'format': 'int32'},
                    'prop12': {'type': 'integer', 'format': 'int64'},
                    'prop13': {'type': 'integer', 'format': 'sbyte'},
                    'prop14': {'type': 'number', 'format': 'float'},
                    'prop15': {'type': 'string', 'format': 'string'},
                    'prop16': {'type': 'string'},
                    'prop17': {'type': 'string', 'format': 'string'},
                    'prop18': {'type': 'string', 'format': 'string'},
                    'prop19': {'type': 'string', 'format': 'string'},
                    'prop20': {'type': 'string', 'format': 'string'},
                    'prop21': {'type': 'string', 'format': 'string'},
                    'prop22': {'type': 'string', 'format': 'string'},
                    'prop23': {'type': 'string', 'format': 'string'},
                    'prop24': {'type': 'string', 'format': 'string'},
                    'prop25': {'type': 'string', 'format': 'string'},
                    'prop26': {'type': 'string', 'format': 'string'},
                    'prop27': {'type': 'string', 'format': 'string'},
                    'prop28': {'type': 'string', 'format': 'string'},
                    'prop29': {'type': 'string', 'format': 'string'},
                    'prop30': {'type': 'string', 'format': 'string'},
                    'prop31': {'type': 'string', 'format': 'string'},
                    'prop32': {'type': 'string', 'format': 'string'},
                    'prop33': {'type': 'string', 'format': 'string'}
                }
            }
        };

        assertDefinition(jsonModel, swaggerModel);
    });
});

describe('[Swagger] To Swagger test', function () {
    it('Api should work.', function () {
        var jsonModel =
                {
                    'api': {
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

    it('Api rootUrl related fields work', function () {
        var jsonModel =
                {
                    'api': {
                        'name': 'host',
                        'rootUrl': 'http://odata.org/odata'
                    }
                };

        var info = {
            'title': 'host',
            'version': '0.0.0.0',
            'schemes': ['http'],
            'host': 'odata.org',
            'basePath': '/odata'
        };

        var sw = toSwagger(jsonModel, undefined, true);
        expect('\n' + JSON.stringify(sw.info)).toEqual('\n' + JSON.stringify(info));
    });

    it('Info object related api fields should match', function () {
        var jsonModel =
                {
                    'api': {
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

        assertApi(jsonModel, expected);
    });
    
    it('Info default version field should match', function () {
        var jsonModel =
                {
                    'api': {
                        'name': 'TripPin OData Reference Service',
                    }
                };

        var expected = {
            'title': 'TripPin OData Reference Service',
            'version': '0.0.0.0'
        };

        assertApi(jsonModel, expected);
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

    it('Definitions of type inheritance should work.', function () {
        var jsonModel =
                {
                    'types': [
                        {
                            'properties': [
                                {
                                    'name': 'planItemId',
                                    'isKey': true,
                                    'type': 'edm.string'
                                },
                                {
                                    'name': 'confirmationCode',
                                    'isNullable': true,
                                    'type': 'edm.string'
                                },
                                {
                                    'name': 'startsAt',
                                    'type': 'edm.datetimeoffset',
                                    'isNullable': true
                                },
                                {
                                    'name': 'endsAt',
                                    'type': 'edm.datetimeoffset',
                                    'isNullable': true
                                },
                                {
                                    'name': 'duration',
                                    'type': 'edm.duration',
                                    'isNullable': true
                                }
                            ],
                            'name': 'planItem'
                        },
                        {
                            'properties': [
                                {
                                    'name': 'seatNumber',
                                    'isNullable': true,
                                    'type': 'edm.string'
                                }
                            ],
                            'name': 'publicTransportation',
                            'baseType': 'planItem'
                        },
                        {
                            'properties': [
                                {
                                    'name': 'flightNumber',
                                    'type': 'edm.string'
                                },
                                {
                                    'name': 'from',
                                    'type': 'airport',
                                    'isNullable': true
                                },
                                {
                                    'name': 'to',
                                    'type': 'airport',
                                    'isNullable': true
                                },
                                {
                                    'name': 'airline',
                                    'type': 'airline',
                                    'isNullable': true
                                }
                            ],
                            'name': 'flight',
                            'baseType': 'publicTransportation'
                        },
                        {
                            'properties': [
                                {
                                    'name': 'description',
                                    'isNullable': true,
                                    'type': 'edm.string'
                                },
                                {
                                    'name': 'occursAt',
                                    'type': 'eventLocation',
                                    'isNullable': true
                                }
                            ],
                            'name': 'event',
                            'baseType': 'planItem'
                        }
                    ]
                };

        var expected = {
            'planItem': {
                'properties': {
                    'planItemId': {
                        'type': 'string'
                    },
                    'confirmationCode': {
                        'type': 'string'
                    },
                    'startsAt': {
                        'type': 'string',
                        'format': 'string'
                    },
                    'endsAt': {
                        'type': 'string',
                        'format': 'string'
                    },
                    'duration': {
                        'type': 'string',
                        'format': 'string'
                    },
                    'planItemType': {
                        'type': 'string'
                    }
                },
                'required': [
                    'planItemId',
                    'planItemType'
                ],
                'discriminator': 'planItemType'
            },
            'publicTransportation': {
                'allOf': [
                    {
                        '$ref': '#/definitions/planItem'
                    },
                    {
                        'properties': {
                            'seatNumber': {
                                'type': 'string'
                            },
                            'publicTransportationType': {
                                'type': 'string'
                            }
                        },
                        'required': [
                            'publicTransportationType'
                        ],
                        'discriminator': 'publicTransportationType'
                    }
                ]
            },
            'flight': {
                'allOf': [
                    {
                        '$ref': '#/definitions/publicTransportation'
                    },
                    {
                        'properties': {
                            'flightNumber': {
                                'type': 'string'
                            },
                            'from': {
                                '$ref': '#/definitions/airport'
                            },
                            'to': {
                                '$ref': '#/definitions/airport'
                            },
                            'airline': {
                                '$ref': '#/definitions/airline'
                            }
                        }
                    }
                ]
            },
            'event': {
                'allOf': [
                    {
                        '$ref': '#/definitions/planItem'
                    },
                    {
                        'properties': {
                            'description': {
                                'type': 'string'
                            },
                            'occursAt': {
                                '$ref': '#/definitions/eventLocation'
                            }
                        }
                    }
                ]
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
                            'description': 'The value of the If-Match request header MUST be an ETag value previously retrieved for the entity, or "*" to match any value.',
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
                            'description': 'The value of the If-Match request header MUST be an ETag value previously retrieved for the entity, or "*" to match any value.',
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
                    'description': 'Returns all items from books without parameters. \n\rOr query a specific info from books, by input parameters as following.',
                    'parameters': [
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$filter',
                            'in': 'query',
                            'description': 'System query option $filter, one or a set of built-in filter operations and functions',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$orderby',
                            'in': 'query',
                            'description': 'System query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces.',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$top',
                            'in': 'query',
                            'description': 'System query option $top, number of items returned from a collection',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$skip',
                            'in': 'query',
                            'description': 'System query option $skip, the service returns items starting at position n+1',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$count',
                            'in': 'query',
                            'description': 'System query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count',
                            'required': false,
                            'type': 'boolean'
                        },  
                        {
                            'name': '$search',
                            'in': 'query',
                            'description': 'System query option $search, restricts the result to include only those entities matching the specified search expression',
                            'required': false,
                            'type': 'string'
                        }, 
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }                                       
                    ],
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
                    'description': 'Returns a single item from books with parameter uid. \n\rAppend parameters prefixed with \'$\' to query specific info from this item.',
                    'parameters': [{
                            'name': 'uid',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true,
                            'type': 'string'
                        },
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }],                    
                    'responses': {
                        '200': {
                            'description': 'A single book item.',
                            'schema': {'$ref': '#/definitions/book'}
                        }
                    }
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
                            'description': 'The value of the If-Match request header MUST be an ETag value previously retrieved for the entity, or "*" to match any value.',
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
                            'description': 'The value of the If-Match request header MUST be an ETag value previously retrieved for the entity, or "*" to match any value.',
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
                    'description': 'Returns me without parameters. \n\rOr query a specific info from me, by input parameters as following.',
                    'parameters': [
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }                                       
                    ],                    
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
                            'description': 'The value of the If-Match request header MUST be an ETag value previously retrieved for the entity, or "*" to match any value.',
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
                    'api':{
                        'namespace': 'namespace'
                    },
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
                                    'description': 'The value of the If-Match request header MUST be an ETag value previously retrieved for the entity, or "*" to match any value.',
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
                                    'description': 'The action returns No Content.'
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
                    'api':{
                        'namespace': 'namespace'
                    },
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
                    'description': 'Returns all items from people without parameters. \n\rOr query a specific info from people, by input parameters as following.',
                    'parameters': [
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$filter',
                            'in': 'query',
                            'description': 'System query option $filter, one or a set of built-in filter operations and functions',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$orderby',
                            'in': 'query',
                            'description': 'System query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces.',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$top',
                            'in': 'query',
                            'description': 'System query option $top, number of items returned from a collection',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$skip',
                            'in': 'query',
                            'description': 'System query option $skip, the service returns items starting at position n+1',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$count',
                            'in': 'query',
                            'description': 'System query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count',
                            'required': false,
                            'type': 'boolean'
                        },  
                        {
                            'name': '$search',
                            'in': 'query',
                            'description': 'System query option $search, restricts the result to include only those entities matching the specified search expression',
                            'required': false,
                            'type': 'string'
                        }, 
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }                                       
                    ],                    
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
                    'description': 'Returns a single item from people with parameter userName. \n\rAppend parameters prefixed with \'$\' to query specific info from this item.',
                    'parameters': [
                        {
                            'name': 'userName',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true,
                            'type': 'string'
                        },
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }
                    ],                    
                    'responses': {
                        '200': {
                            'description': 'A single person item.',
                            'schema': {
                                '$ref': '#/definitions/person'
                            }
                        }
                    }
                }
            },
            '/people/{userName}/namespace.actionTest': {
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
                            'description': 'The value of the If-Match request header MUST be an ETag value previously retrieved for the entity, or "*" to match any value.',
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
                            'description': 'The action returns No Content.'
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
                    'api':{
                        'namespace': 'namespace'
                    },
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
                                'returns': {
                                    'type': 'edm.int32'
                                }
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
                    'api':{
                        'namespace': 'namespace'
                    },
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
                                    'operationType': 'Bound',
                                    'returns': {
                                    'type': 'string[]'
                                },
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
                    'description': 'Returns all items from people without parameters. \n\rOr query a specific info from people, by input parameters as following.',
                    'parameters': [
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },                                           
                        {
                            'name': '$filter',
                            'in': 'query',
                            'description': 'System query option $filter, one or a set of built-in filter operations and functions',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$orderby',
                            'in': 'query',
                            'description': 'System query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces.',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$top',
                            'in': 'query',
                            'description': 'System query option $top, number of items returned from a collection',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$skip',
                            'in': 'query',
                            'description': 'System query option $skip, the service returns items starting at position n+1',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$count',
                            'in': 'query',
                            'description': 'System query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count',
                            'required': false,
                            'type': 'boolean'
                        },  
                        {
                            'name': '$search',
                            'in': 'query',
                            'description': 'System query option $search, restricts the result to include only those entities matching the specified search expression',
                            'required': false,
                            'type': 'string'
                        }, 
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }                                       
                    ],                    
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
                    'description': 'Returns a single item from people with parameter userName. \n\rAppend parameters prefixed with \'$\' to query specific info from this item.',
                    'parameters': [
                        {
                            'name': 'userName',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true,
                            'type': 'string'
                        },
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }
                    ],                   
                    'responses': {
                        '200': {
                            'description': 'A single person item.',
                            'schema': {
                                '$ref': '#/definitions/person'
                            }
                        }
                    }
                }
            },
            '/people/{userName}/namespace.functionTest': {
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
                        },
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }
                    ],
                    'responses': {
                        '200': {
                            'description': 'The function has been returned results.',
                            'schema': {
                                '$ref': '#/definitions/string[]'
                            }
                        }
                    }
                }
            }
        };
        assertPaths(input, expected);
    });

    it('System query options for functions should work.', function () {
        var input =
                {
                    'api':{
                        'namespace': 'namespace'
                    },
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
                            'properties': [
                                {
                                    'name': 'countryRegion',
                                    'type': 'edm.string'
                                },
                                {
                                    'name': 'region',
                                    'type': 'edm.string'
                                }
                            ],
                            'name': 'city'
                        },
                        {
                            'properties': [
                                {
                                    'name': 'loc',
                                    'type': 'edm.geographypoint'
                                }
                            ],
                            'name': 'location',
                            'baseType': 'city'
                        },
                    {
                        'properties': [
                            {
                                'name': 'userName',
                                'type': 'edm.string',
                                'isKey': true
                            },
                            {
                                'name': 'gender',
                                'type': 'personGender'
                            },
                            {
                                'name': 'home',
                                'type': 'location'
                            },
                            {
                                'name': 'getBestFriend',
                                'type': 'Function',
                                'params': [
                                    {
                                        'name': 'userName',
                                        'type': 'edm.string'
                                    }
                                ],
                                'returns': {
                                    'type': 'person'
                                },
                                'operationType': 'Bound'
                            },
                            {
                                'name': 'getInvolvedPeople',
                                'type': 'Function',
                                'returns': {
                                    'type': 'person',
                                    'isCollection': true
                                },
                                'operationType': 'Bound'
                            },
                            {
                                'name': 'getHomeAddress',
                                'type': 'Function',
                                'params': [
                                    {
                                        'name': 'userName',
                                        'type': 'edm.string'
                                    }
                                ],
                                'returns': {
                                    'type': 'location'
                                },
                                'operationType': 'Bound'
                            },
                            {
                                'name': 'getEventLocation',
                                'type': 'Function',
                                'params': [
                                    {
                                        'name': 'userName',
                                        'type': 'edm.string'
                                    }
                                ],
                                'returns': {
                                    'type': 'city',
                                    'isCollection': true
                                },
                                'operationType': 'Bound'
                            },
                            {
                                'name': 'getFriendNames',
                                'type': 'Function',
                                'returns': {
                                    'type': 'edm.string',
                                    'isCollection': true
                                },
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
                    'description': 'Returns all items from people without parameters. \n\rOr query a specific info from people, by input parameters as following.',
                    'parameters': [
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        }, 
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },                                           
                        {
                            'name': '$filter',
                            'in': 'query',
                            'description': 'System query option $filter, one or a set of built-in filter operations and functions',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$orderby',
                            'in': 'query',
                            'description': 'System query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces.',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$top',
                            'in': 'query',
                            'description': 'System query option $top, number of items returned from a collection',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$skip',
                            'in': 'query',
                            'description': 'System query option $skip, the service returns items starting at position n+1',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$count',
                            'in': 'query',
                            'description': 'System query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count',
                            'required': false,
                            'type': 'boolean'
                        },  
                        {
                            'name': '$search',
                            'in': 'query',
                            'description': 'System query option $search, restricts the result to include only those entities matching the specified search expression',
                            'required': false,
                            'type': 'string'
                        }, 
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }                                       
                    ],                    
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
                    'description': 'Returns a single item from people with parameter userName. \n\rAppend parameters prefixed with \'$\' to query specific info from this item.',
                    'parameters': [
                        {
                            'name': 'userName',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true,
                            'type': 'string'
                        },
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }                          
                    ],                   
                    'responses': {
                        '200': {
                            'description': 'A single person item.',
                            'schema': {
                                '$ref': '#/definitions/person'
                            }
                        }
                    }
                }
            },
            '/people/{userName}/namespace.getBestFriend': {
                'get': {
                    'tags': [
                        'Function',
                        'Bound'
                    ],
                    'description': 'Bound function: getBestFriend.',
                    'parameters': [
                        {
                            'name': 'userName',
                            'type': 'string',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true
                        },
                        {
                            'name': 'userName',
                            'type': 'string',
                            'in': 'formData',
                            'description': 'The parameter.',
                            'required': true
                        },
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }   
                    ],
                    'responses': {
                        '200': {
                            'description': 'The function has been returned results.',
                            'schema': {
                                '$ref': '#/definitions/person'
                            }
                        }
                    }
                }
            },
            '/people/{userName}/namespace.getInvolvedPeople': {
                'get': {
                    'tags': [
                        'Function',
                        'Bound'
                    ],
                    'description': 'Bound function: getInvolvedPeople.',
                    'parameters': [
                        {
                            'name': 'userName',
                            'type': 'string',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true
                        },
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },                                
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$filter',
                            'in': 'query',
                            'description': 'System query option $filter, one or a set of built-in filter operations and functions',
                            'required': false,
                            'type': 'string'
                        },                                
                        {
                            'name': '$orderby',
                            'in': 'query',
                            'description': 'System query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces.',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$top',
                            'in': 'query',
                            'description': 'System query option $top, number of items returned from a collection',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$skip',
                            'in': 'query',
                            'description': 'System query option $skip, the service returns items starting at position n+1',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$count',
                            'in': 'query',
                            'description': 'System query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count',
                            'required': false,
                            'type': 'boolean'
                        }, 
                        {
                            'name': '$search',
                            'in': 'query',
                            'description': 'System query option $search, restricts the result to include only those entities matching the specified search expression',
                            'required': false,
                            'type': 'string'
                        },                                 
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }       
                    ],
                    'responses': {
                        '200': {
                            'description': 'The function has been returned results.',
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
            '/people/{userName}/namespace.getHomeAddress': {
                'get': {
                    'tags': [
                        'Function',
                        'Bound'
                    ],
                    'description': 'Bound function: getHomeAddress.',
                    'parameters': [
                        {
                            'name': 'userName',
                            'type': 'string',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true
                        },
                        {
                            'name': 'userName',
                            'type': 'string',
                            'in': 'formData',
                            'description': 'The parameter.',
                            'required': true
                        },
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },                                
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        }, 
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        } 
                    ],
                    'responses': {
                        '200': {
                            'description': 'The function has been returned results.',
                            'schema': {
                                '$ref': '#/definitions/location'
                            }
                        }
                    }
                }
            },
            '/people/{userName}/namespace.getEventLocation': {
                'get': {
                    'tags': [
                        'Function',
                        'Bound'
                    ],
                    'description': 'Bound function: getEventLocation.',
                    'parameters': [
                        {
                            'name': 'userName',
                            'type': 'string',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true
                        },
                        {
                            'name': 'userName',
                            'type': 'string',
                            'in': 'formData',
                            'description': 'The parameter.',
                            'required': true
                        },
                        {
                            'name': '$select',
                            'in': 'query',
                            'description': 'System query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema',
                            'required': false,
                            'type': 'string'
                        },                                
                        {
                            'name': '$expand',
                            'in': 'query',
                            'description': 'System query option $expand, a comma-separated list of navigation property names',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$filter',
                            'in': 'query',
                            'description': 'System query option $filter, one or a set of built-in filter operations and functions',
                            'required': false,
                            'type': 'string'
                        },                                
                        {
                            'name': '$orderby',
                            'in': 'query',
                            'description': 'System query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces.',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$top',
                            'in': 'query',
                            'description': 'System query option $top, number of items returned from a collection',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$skip',
                            'in': 'query',
                            'description': 'System query option $skip, the service returns items starting at position n+1',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$count',
                            'in': 'query',
                            'description': 'System query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count',
                            'required': false,
                            'type': 'boolean'
                        }, 
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }                               
                    ],
                    'responses': {
                        '200': {
                            'description': 'The function has been returned results.',
                            'schema': {
                                'type': 'array',
                                'items': {
                                    '$ref': '#/definitions/city'
                                }
                            }
                        }
                    }

                }
            },
            '/people/{userName}/namespace.getFriendNames': {
                'get': {
                    'tags': [
                        'Function',
                        'Bound'
                    ],
                    'description': 'Bound function: getFriendNames.',
                    'parameters': [
                        {
                            'name': 'userName',
                            'type': 'string',
                            'in': 'path',
                            'description': 'The key.',
                            'required': true
                        },
                        {
                            'name': '$filter',
                            'in': 'query',
                            'description': 'System query option $filter, one or a set of built-in filter operations and functions',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$orderby',
                            'in': 'query',
                            'description': 'System query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces.',
                            'required': false,
                            'type': 'string'
                        },
                        {
                            'name': '$top',
                            'in': 'query',
                            'description': 'System query option $top, number of items returned from a collection',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$skip',
                            'in': 'query',
                            'description': 'System query option $skip, the service returns items starting at position n+1',
                            'required': false,
                            'type': 'number'
                        },
                        {
                            'name': '$count',
                            'in': 'query',
                            'description': 'System query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count',
                            'required': false,
                            'type': 'boolean'
                        }, 
                        {
                            'name': '$format',
                            'in': 'query',
                            'description': 'System query option $format such as json, application/json, application/json;odata.metadata=full',
                            'required': false,
                            'type': 'string'
                        }                             
                    ],
                    'responses': {
                        '200': {
                            'description': 'The function has been returned results.',
                            'schema': {
                                'type': 'array',
                                'items': {
                                    'type': 'string'
                                }
                            }
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

function assertApi(input, output) {
    expect('\n' + toSwagger(input, 'info')).toEqual('\n' + JSON.stringify(output));
}

function toSwagger(input, section, returnJson) {
    var result = Morpho.convertTo.swagger.call(Morpho, input, {}, {returnJSON: true});
    if (section) {
        result = result[section];
    }

    return returnJson ? result : JSON.stringify(result);
}