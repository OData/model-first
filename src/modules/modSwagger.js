(function () {
    function SwaggerType(type, format) {
        this.type = type;
        if (format) this.format = format;
    }

    var SwaggerTypes = {
        'integer': new SwaggerType('integer', 'int32'),
        'long': new SwaggerType('integer', 'int64'),
        'float': new SwaggerType('number', 'float'),
        'double': new SwaggerType('number', 'double'),
        'string': new SwaggerType('string', undefined),
        'byte': new SwaggerType('string', 'byte'),
        'boolean': new SwaggerType('boolean', undefined),
        'date': new SwaggerType('string', 'date'),
        'dateTime': new SwaggerType('string', 'date-time'),
        'password': new SwaggerType('string', 'password'),
        // The follwing types are not defined in Swagger schema
        'decimal': new SwaggerType('number', 'decimal'),
        'short': new SwaggerType('number', 'int16'),
        'guid': new SwaggerType('string', 'guid'),
        'dateTimeOffset': new SwaggerType('string', 'dateTimeOffset'),
        'duration': new SwaggerType('string', 'duration'),
    };

    var typeMap = {
        'Binary': undefined,
        'Boolean': SwaggerTypes.boolean,
        'Byte': SwaggerTypes.byte,
        'Date': SwaggerTypes.date,
        'DateTimeOffset': SwaggerTypes.dateTimeOffset,
        'Decimal': SwaggerTypes.decimal,
        'Double': SwaggerTypes.double,
        'Duration': SwaggerTypes.duration,
        'Guid': SwaggerTypes.guid,
        'Int16': SwaggerTypes.short,
        'Int32': SwaggerTypes.integer,
        'Int64': SwaggerTypes.long,
        // 'SByte'   : 'Edm.SByte',
        'Single': SwaggerTypes.float,
        // 'Stream': 'Edm.Stream',
        'String': SwaggerTypes.string,
        // 'TimeOfDay': 'Edm.TimeOfDay',
    };

    var entitySetMappings = {};

    function getSwaggerType(type, isCollection) {
        var sType = type === undefined ?
            SwaggerTypes.string :
            typeMap[type];

        if (!sType) {
            if (type.length > 4 && type.slice(0, 4) === 'edm.') {
                sType = new SwaggerType('string', type);
            } else {
                sType = {'$ref': '#/definitions/' + type};
            }
        }

        return isCollection ? {'type': 'array', 'items': sType} : sType;
    }

    // Gets a singleton/entity-set's name.
    // params:
    // 'entityType': Inputs a entity type name.
    // returns:
    // An object contains a entity-set's name and a convertion result (true/false).
    function getEntitySet(entityType) {
        var result = entitySetMappings[entityType];
        var success = false;
        if (result) {
            success = true;
        }

        return {
            'entitySet': result,
            'success': success
        };
    }

    function detectCollectionType(targetType) {
        var type, col;
        if (targetType[targetType.length - 1] === ']') {
            type = targetType.substr(0, targetType.length - 2);
            col = true;
        }
        else {
            type = targetType;
            col = false;
        }

        return {
            'type': type,
            'isCol': col
        };
    }

    function routeAction(name, operationType, params, parentType, swKey, returns) {
        var parameters = [];
        var ifMatchHeader = {
            'name': 'If-Match',
            'type': 'string',
            'in': 'header',
            'description': 'The If-Match header.',
            'required': false
        };
        parameters.push(ifMatchHeader);
        if ('Bound' === operationType) {
            var bindingParam = {
                'name': swKey.name,
                'type': swKey.type,
                'in': 'path',
                'description': 'The key.',
                'required': true
            };
            parameters.push(bindingParam);
        }
        for (var i in params) {
            var isCollection = params[i].type[params[i].type.length - 1] === ']';
            var param = {
                'name': params[i].name,
                'type': getSwaggerType(params[i].type, isCollection),
                'in': 'formData',
                'description': 'The parameter.',
                'required': true
            };
            parameters.push(param);
        }
        var path;
        if ('Bound' === operationType) {
            var temp = getEntitySet(parentType);
            if (temp.success) {
                path = '/' + temp.entitySet + '/{' + swKey.name + '}/' + name;
            }
            else {
                path = '/' + parentType + '/' + name;
            }
        }
        else if ('Unbound' === operationType) {
            path = '/' + name;
        }

        var responses = {
            '201': {
                'description': 'The action has been created new entities.'
            },
            '204': {
                'description': 'The action is without a return type.'
            }
        };
        if (returns) {
            var returnType = detectCollectionType(returns);
            var schema = getSwaggerType(returnType.type, returnType.isCol);

            responses['200'] = {
                'description': 'The function has been returned results.',
                'schema': schema
            };
        }

        return {
            'route': {
                'tags': ['Action', operationType],
                'description': operationType + ' ' + 'action: ' + name + '.',
                'parameters': parameters,
                'responses': responses
            },
            'path': path
        };
    }

    function routeFunction(name, operationType, params, parentType, swKey, returns) {
        var parameters = [];
        if ('Bound' === operationType) {
            var bindingParam = {
                'name': swKey.name,
                'type': swKey.type,
                'in': 'path',
                'description': 'The key.',
                'required': true
            };
            parameters.push(bindingParam);
        }
        for (var i in params) {
            var isCollection = params[i].type[params[i].type.length - 1] === ']';
            var param = {
                'name': params[i].name,
                'type': getSwaggerType(params[i].type, isCollection),
                'in': 'formData',
                'description': 'The parameter.',
                'required': true
            };
            parameters.push(param);
        }
        var path;
        if ('Bound' === operationType) {
            var temp = getEntitySet(parentType);
            if (temp.success) {
                path = '/' + temp.entitySet + '/{' + swKey.name + '}/' + name;
            }
            else {
                path = '/' + parentType + '/' + name;
            }
        }
        else if ('Unbound' === operationType) {
            path = '/' + name;
        }

        var responses = {
            '204': {
                'description': 'The function is without a return type.'
            },
            '400': {
                'description': 'A single entity function with a non-nullable return type has no result.'
            }
        };
        var schema;
        if (returns) {
            var returnType = detectCollectionType(returns);
            var schema = getSwaggerType(returnType.type, returnType.isCol);

            responses['200'] = {
                'description': 'The function has been returned results.',
                'schema': schema
            };
        }

        return {
            'route': {
                'tags': ['Function', operationType],
                'description': operationType + ' ' + 'function: ' + name + '.',
                'parameters': parameters,
                'responses': responses
            },
            'path': path
        };
    }

    function routeOperation(name, type, operationType, params, parentType, swKey, returns) {
        if ('Action' === type) {
            return routeAction(name, operationType, params, parentType, swKey, returns);
        }
        else if ('Function' === type) {
            return routeFunction(name, operationType, params, parentType, swKey, returns);
        }
    }

    function addPaths(model, resolveKey) {
        function getSchema(type, isCollection) {
            var sref = {'$ref': '#/definitions/' + type};
            return isCollection ? {'type': 'array', 'items': sref} : sref;
        }

        function routeGet(name, type, isCollection, swKey) {
            var route = {
                'tags': [type],
                'description': isCollection ?
                'Returns all items from ' + name + '.' :
                    swKey ?
                    'Returns a single item from ' + name + '.' :
                    'Returns ' + name + '.',
                'responses': {
                    '200': {
                        'description': isCollection ?
                        'An array of ' + type + ' items.' :
                        'A single ' + type + ' item.',
                        'schema': getSchema(type, isCollection)
                    }
                }
            };

            if (swKey) {
                var parameter =
                {
                    'name': swKey.name,
                    'in': 'path',
                    'description': 'The key.',
                    'required': true,
                    'type': swKey.type,
                };
                if (swKey.format) parameter.format = swKey.format;

                route.parameters = [parameter];
            }

            return route;
        }

        function routePost(name, type) {
            var singleSchema = getSchema(type, false);
            return {
                'tags': [type],
                'description': 'Adds a new ' + type + ' to ' + name + '.',
                'parameters': [
                    {
                        'name': type,
                        'in': 'body',
                        'description': 'The new ' + type + ' item.',
                        'required': true,
                        'schema': singleSchema
                    }
                ],
                'responses': {
                    '201': {
                        'description': 'The newly added ' + type + ' item.',
                        'schema': singleSchema
                    },
                }
            };
        }

        function routePut(name, type, swKey) {
            var route = {
                'tags': [type],
                'description': swKey ?
                'Update an existing ' + type + ' item.' :
                'Update ' + name + '.',
                'parameters': [
                    {
                        'name': type,
                        'in': 'body',
                        'description': 'The new ' + type + ' item.',
                        'required': true,
                        'schema': getSchema(type, false)
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
                    },
                }
            };

            if (swKey) {
                var parameter = {
                    'name': swKey.name,
                    'in': 'path',
                    'description': 'The key.',
                    'required': true,
                    'type': swKey.type,
                };

                if (swKey.format) parameter.format = swKey.format;
                route.parameters.unshift(parameter);
            }

            return route;
        }

        function routeDelete(name, type, swKey) {
            var parameter = {
                'name': swKey.name,
                'in': 'path',
                'description': 'The key.',
                'required': true,
                'type': swKey.type,
            };
            if (swKey.format) parameter.format = swKey.format;

            return {
                'tags': [type],
                'description': 'Delete an item from ' + name + '.',
                'parameters': [
                    parameter,
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
                    },
                }
            };
        }

        function genAllows(allows) {
            if (!allows) return {'read': true};

            var ac = {};
            for (var i = 0; i < allows.length; i++) {
                ac[allows[i]] = true;
            }

            return ac;
        }

        if (!model.container) return;

        var paths = {};
        var visitor = new Visitor();

        visitor.visitObj(model.container, {
            'entitysets': function (arr) {
                visitor.visitArr(arr, function (item) {
                    var allows = genAllows(item.allows);
                    var routes = {};
                    if (allows.read) routes.get = routeGet(item.name, item.type, true);
                    if (allows.create) routes.post = routePost(item.name, item.type);
                    paths['/' + item.name] = routes;

                    var swKey = resolveKey(item.type);
                    if (swKey) {
                        var sRoutes = {};
                        if (allows.read) sRoutes.get = routeGet(item.name, item.type, false, swKey);
                        if (allows.update) sRoutes.put = routePut(item.name, item.type, swKey);
                        if (allows.delete) sRoutes.delete = routeDelete(item.name, item.type, swKey);
                        paths['/' + item.name + '/{' + swKey.name + '}'] = sRoutes;
                    }
                });
            },
            'singletons': function (arr) {
                visitor.visitArr(arr, function (item) {
                    var allows = genAllows(item.allows);
                    var routes = {};
                    if (allows.read) routes.get = routeGet(item.name, item.type, false);
                    if (allows.update) routes.put = routePut(item.name, item.type);
                    paths['/' + item.name] = routes;
                });
            },
            'operations': function (arr) {
                visitor.visitArr(arr, function (item) {
                    if ('Action' === item.type) {
                        var temp = routeOperation(item.name, item.type, item.operationType, item.params, null, null, item.returns);
                        var routes = {
                            'post': temp.route
                        };
                        paths[temp.path] = routes;
                    }
                    else if ('Function' === item.type) {
                        var temp = routeOperation(item.name, item.type, item.operationType, item.params, null, null, item.returns);
                        var routes = {
                            'get': temp.route
                        };
                        paths[temp.path] = routes;
                    }
                });
            }
        });

        return paths;
    }

    Morpho.registerTo('swagger', function (model, errors, option) {
        var visitor = this.getVisitor();
        var state = {
            'swagger': '2.0',
            'info': {
                'title': 'Demo',
                'version': '0.1'
            },
            'paths': {}
        };

        var keys = {};
        var boundOpPaths = {};

        visitor.visitObj(model, {
            'api': function (api) {
                this.visitObj(api, {
                    'name': function (name) {
                        state.info.title = name;
                    },
                    'version': function (version) {
                        if (version.current || version.current === 0)
                            state.info.version = version.current;
                        else
                            state.info.version = version;
                    },
                    'termsOfService': function (termsOfService) {
                        state.info.termsOfService = termsOfService;
                    },
                    'contact': function (obj) {
                        state.info.contact = obj;
                    },
                    'license': function (obj) {
                        state.info.license = obj;
                    },
                    'description': function (description) {
                        state.info.description = description;
                    },
                    'host': function (obj) {
                        state.host = obj;
                    },
                    'basePath': function (obj) {
                        state.basePath = obj;
                    }
                });
            },
            'container': function (container) {
                this.visitObj(container, {
                    'entitysets': function (arr) {
                        visitor.visitArr(arr, function (item) {
                            entitySetMappings[item.type] = item.name;
                        });
                    },
                    'singletons': function (arr) {
                        visitor.visitArr(arr, function (item) {
                            //entitySetMappings[item.type] = item.name;
                        });
                    }
                });
            },
            'types': function (arr) {
                state.definitions = {};
                this.visitArr(arr, function (item) {
                    var type = {properties: {}};

                    function handleMember(obj) {
                        var member;

                        if (typeof obj === 'string') {
                            member = obj;
                        } else {
                            member = obj.name;
                        }

                        return member;
                    }

                    this.visitObj(item, {
                        'members': function (obj) {
                            type.type = 'string';
                            type['enum'] = [];
                            delete type.properties;
                            this.visitArr(obj, function (obj) {
                                type['enum'].push(handleMember(obj));
                            });
                        }
                    });

                    var keyProperty = null;
                    var parentTypeName = item.name;
                    if (item.properties) {
                        visitor.visitArr(item.properties, function (item) {
                            if (!item.operationType) {
                                var swType = getSwaggerType(item.type, item.isCollection);
                                var propertyType;
                                if (swType.type) {
                                    propertyType = {type: swType.type};
                                    if (swType.format) propertyType.format = swType.format;
                                    if (swType.items) propertyType.items = swType.items;
                                } else {
                                    propertyType = swType;
                                }

                                type.properties[item.name] = propertyType;

                                if (!keyProperty && item.isKey) {
                                    keyProperty = {
                                        'name': item.name,
                                        'type': swType.type,
                                        // add paths would check whether format undefined.
                                        'format': swType.format
                                    };
                                }
                            }
                        });


                        if (keyProperty) {
                            keys[item.name] = keyProperty;
                        }
                        // Convert bound operations (actions and functions).
                        visitor.visitArr(item.properties, function (item) {
                            if (item.operationType) {
                                var swKey = keys[parentTypeName];
                                if (swKey) {
                                    if ('Action' === item.type) {
                                        var temp = routeOperation(item.name, item.type, item.operationType, item.params, parentTypeName, swKey, item.returns);
                                        var routes = {
                                            'post': temp.route
                                        };
                                        boundOpPaths[temp.path] = routes;
                                    }
                                    else if ('Function' === item.type) {
                                        var temp = routeOperation(item.name, item.type, item.operationType, item.params, parentTypeName, swKey, item.returns);
                                        var routes = {
                                            'get': temp.route
                                        };
                                        boundOpPaths[temp.path] = routes;
                                    }
                                }
                            }
                        });
                    }
                    state.definitions[item.name] = type;
                });
            }
        });

        state.paths = addPaths(model, function (type) {
            return keys[type];
        });

        for (var i in boundOpPaths) {
            state.paths[i] = boundOpPaths[i];
        }

        if (option.returnJSON) {
            return state;
        } else if (option.format) {
            return JSON.stringify(state, null, 2);
        }

        return JSON.stringify(state);
    });
})();