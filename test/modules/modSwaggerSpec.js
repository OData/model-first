'use strict';

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
                    'underlyingType': 'int32'
                },
                {
                    'name': 'Book',
                    'properties': [
                        {
                            'name': 'id',
                            'type': 'Int64'
                        },
                        {
                            'name': 'title',
                            //'type'    : 'String',
                        },
                        {
                            'name': 'keywords',
                            'type': 'String',
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

    it('Definitions multiple properties with all inner types.', function () {
        var jsonModel =
        {
            'types': [
                {
                    'properties': [
                        {
                            'name': 'p1',
                            'type': 'Boolean'
                        },
                        {
                            'name': 'p2',
                            'type': 'Byte'
                        },
                        {
                            'name': 'p3',
                            'type': 'Date'
                        },
                        {
                            'name': 'p4',
                            'type': 'DateTimeOffset'
                        },
                        {
                            'name': 'p5',
                            'type': 'Decimal'
                        },
                        {
                            'name': 'p6',
                            'type': 'Double'
                        },
                        {
                            'name': 'p7',
                            'type': 'Duration'
                        },
                        {
                            'name': 'p8',
                            'type': 'Guid'
                        },
                        {
                            'name': 'p9',
                            'type': 'Int16'
                        },
                        {
                            'name': 'p10',
                            'type': 'Int32'
                        },
                        {
                            'name': 'p11',
                            'type': 'Int64',
                            'isNullable': true
                        },
                        {
                            'name': 'p12',
                            'type': 'Single',
                            'isNullable': true
                        },
                        {
                            'name': 'p13',
                            'type': 'String',
                            'isNullable': true
                        }
                    ],
                    'name': 'type1'
                }
            ]
        };

        var expected = {
            'type1': {
                'properties': {
                    'p1': {
                        'type': 'boolean'
                    },
                    'p2': {
                        'type': 'string',
                        'format': 'byte'
                    },
                    'p3': {
                        'type': 'string',
                        'format': 'date'
                    },
                    'p4': {
                        'type': 'string',
                        'format': 'dateTimeOffset'
                    },
                    'p5': {
                        'type': 'number',
                        'format': 'decimal'
                    },
                    'p6': {
                        'type': 'number',
                        'format': 'double'
                    },
                    'p7': {
                        'type': 'string',
                        'format': 'duration'
                    },
                    'p8': {
                        'type': 'string',
                        'format': 'guid'
                    },
                    'p9': {
                        'type': 'number',
                        'format': 'int16'
                    },
                    'p10': {
                        'type': 'integer',
                        'format': 'int32'
                    },
                    'p11': {
                        'type': 'integer',
                        'format': 'int64'
                    },
                    'p12': {
                        'type': 'number',
                        'format': 'float'
                    },
                    'p13': {
                        'type': 'string'
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
                            'type': 'Int64'
                        },
                        {
                            'name': 'title',
                            //'type'    : 'String',
                        },
                        {
                            'name': 'day',
                            'type': 'Date',
                            'isCollection': false
                        },
                        {
                            'name': 'keywords',
                            'type': 'String',
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
					  'type': 'String'
					},
					{
					  'name': 'confirmationCode',
					  'isNullable': true,
					  'type': 'String'
					},
					{
					  'name': 'startsAt',
					  'type': 'DateTimeOffset',
					  'isNullable': true
					},
					{
					  'name': 'endsAt',
					  'type': 'DateTimeOffset',
					  'isNullable': true
					},
					{
					  'name': 'duration',
					  'type': 'Duration',
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
					  'type': 'String'
					}
				  ],
				  'name': 'publicTransportation',
				  'baseType': 'planItem'
  			  },
			  {
				  'properties': [
					{
					  'name': 'flightNumber',
					  'type': 'String'
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
					  'type': 'String'
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
				  'format': 'dateTimeOffset'
				},
				'endsAt': {
				  'type': 'string',
				  'format': 'dateTimeOffset'
				},
				'duration': {
				  'type': 'string',
				  'format': 'duration'
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
                                'type': 'Int32'
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
                            'type': {
                                'type': 'integer',
                                'format': 'int32'
                            },
                            'in': 'formData',
                            'description': 'The parameter.',
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
                            'type': 'String',
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
                                'type': 'Int32'
                            }
                        ],
                        'returns': 'Int32'
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
                            'type': {
                                'type': 'integer',
                                'format': 'int32'
                            },
                            'in': 'formData',
                            'description': 'The parameter.',
                            'required': true
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
                            'type': 'String',
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
