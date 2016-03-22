(function () {
    function SwaggerType(type, format) {
        this.type = type;
        if (format)
            this.format = format;
    }

    var SwaggerTypes = {
        // Types are defined in Swagger Spec. 
        'edm.int32': new SwaggerType('integer', 'int32'),
        'edm.int64': new SwaggerType('integer', 'int64'),
        'edm.single': new SwaggerType('number', 'float'),
        'edm.double': new SwaggerType('number', 'double'),
        'edm.string': new SwaggerType('string', undefined),
        'edm.byte': new SwaggerType('string', 'byte'),
        'edm.binary': new SwaggerType('string', 'binary'),
        'edm.boolean': new SwaggerType('boolean', undefined),
        'edm.date': new SwaggerType('string', 'date'),
        // Extention types are not defined in Swagger Spec.
        'edm.decimal': new SwaggerType('number', 'decimal'),
        'edm.int16': new SwaggerType('integer', 'int16'),
        'edm.sbyte': new SwaggerType('integer', 'sbyte')
    };

    var typeMap = {
        'edm.datetimeoffset': 'dateTimeOffset',
        'edm.duration': 'duration',
        'edm.guid': 'guid',
        'edm.stream': 'stream',
        'edm.timeofday': 'timeOfDay',
        'edm.geography': 'geography',
        'edm.geographypoint': 'geographyPoint',
        'edm.geographylinestring': 'geographyLineString',
        'edm.geographypolygon': 'geographyPolygon',
        'edm.geographymultipoint': 'geographyMultiPoint',
        'edm.geographymultilinestring': 'geographyMultiLineString',
        'edm.geographymultipolygon': 'geographyMultiPolygon',
        'edm.geographycollection': 'geographyCollection',
        'edm.geometry': 'geometry',
        'edm.geometrypoint': 'geometryPoint',
        'edm.geometrylinestring': 'geometryLineString',
        'edm.geometrypolygon': 'geometryPolygon',
        'edm.geometrymultipoint': 'geometryMultiPoint',
        'edm.geometrymultilinestring': 'geometryMultiLineString',
        'edm.geometrymultipolygon': 'geometryMultiPolygon',
        'edm.geometrycollection': 'geometryCollection'
    };

    function getSwaggerType(type, isCollection) {
        var swgrType;
        if (SwaggerTypes[type]) {
            swgrType = SwaggerTypes[type];
        } else if (typeMap[type]) {
            swgrType = new SwaggerType('string', 'string');
        } else {
            swgrType = {'$ref': '#/definitions/' + type};
        }

        return isCollection ? {'type': 'array', 'items': swgrType} : swgrType;
    }

    var entitySetMappings = {};

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

        var isCollection;
        for (var i in params) {
            isCollection = params[i].isCollection && params[i].isCollection === true;
            var swType = getSwaggerType(params[i].type, isCollection);
            var param = {
                'name': params[i].name,
                'type': swType.type,
                'in': 'formData',
                'description': 'The parameter.',
                'required': true
            };
            if (swType.format) {
                param.format = swType.format;
            }
            if (swType.items) {
                param.items = swType.items;
            }
            parameters.push(param);
        }
        var path;
        if ('Bound' === operationType) {
            var temp = getEntitySet(parentType);
            if (temp.success) {
                path = '/' + temp.entitySet + '/{' + swKey.name + '}/' + name;
            } else {
                path = '/' + parentType + '/' + name;
            }
        } else if ('Unbound' === operationType) {
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
            isCollection = returns.isCollection && returns.isCollection === true;
            var schema = getSwaggerType(returns.type, isCollection);

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

        var isCollection;
        for (var i in params) {
            isCollection = params[i].isCollection && params[i].isCollection === true;
            var swType = getSwaggerType(params[i].type, isCollection);
            var param = {
                'name': params[i].name,
                'type': swType.type,
                'in': 'formData',
                'description': 'The parameter.',
                'required': true
            };
            if (swType.format) {
                param.format = swType.format;
            }
            if (swType.items) {
                param.items = swType.items;
            }
            parameters.push(param);
        }
        var path;
        if ('Bound' === operationType) {
            var temp = getEntitySet(parentType);
            if (temp.success) {
                path = '/' + temp.entitySet + '/{' + swKey.name + '}/' + name;
            } else {
                path = '/' + parentType + '/' + name;
            }
        } else if ('Unbound' === operationType) {
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
        if (returns) {
            isCollection = returns.isCollection && returns.isCollection === true;
            var schema = getSwaggerType(returns.type, isCollection);

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
        } else if ('Function' === type) {
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
                if (swKey.format)
                    parameter.format = swKey.format;

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

                if (swKey.format)
                    parameter.format = swKey.format;
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
            if (swKey.format)
                parameter.format = swKey.format;

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
            if (!allows)
                return {'read': true};

            var ac = {};
            for (var i = 0; i < allows.length; i++) {
                ac[allows[i]] = true;
            }

            return ac;
        }

        if (!model.container)
            return;

        var paths = {};
        var visitor = new Visitor();

        visitor.visitObj(model.container, {
            'entitysets': function (arr) {
                visitor.visitArr(arr, function (item) {
                    var allows = genAllows(item.allows);
                    var routes = {};
                    if (allows.read)
                        routes.get = routeGet(item.name, item.type, true);
                    if (allows.create)
                        routes.post = routePost(item.name, item.type);
                    paths['/' + item.name] = routes;

                    var swKey = resolveKey(item.type);
                    if (swKey) {
                        var sRoutes = {};
                        if (allows.read)
                            sRoutes.get = routeGet(item.name, item.type, false, swKey);
                        if (allows.update)
                            sRoutes.put = routePut(item.name, item.type, swKey);
                        if (allows.delete)
                            sRoutes.delete = routeDelete(item.name, item.type, swKey);
                        paths['/' + item.name + '/{' + swKey.name + '}'] = sRoutes;
                    }
                });
            },
            'singletons': function (arr) {
                visitor.visitArr(arr, function (item) {
                    var allows = genAllows(item.allows);
                    var routes = {};
                    if (allows.read)
                        routes.get = routeGet(item.name, item.type, false);
                    if (allows.update)
                        routes.put = routePut(item.name, item.type);
                    paths['/' + item.name] = routes;
                });
            },
            'operations': function (arr) {
                visitor.visitArr(arr, function (item) {
                    var temp;
                    var routes;
                    if ('Action' === item.type) {
                        temp = routeOperation(item.name, item.type, item.operationType, item.params, null, null, item.returns);
                        routes = {
                            'post': temp.route
                        };
                        paths[temp.path] = routes;
                    } else if ('Function' === item.type) {
                        temp = routeOperation(item.name, item.type, item.operationType, item.params, null, null, item.returns);
                        routes = {
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
                    'rootUrl': function (rootUrl) {
                        var res = rootUrl.split('://');
                        if (res.length == 2) {
                            state.info.schemes = [res[0]];
                            var index = res[1].indexOf('/');
                            if (index === -1) {
                                index = res[1].length;
                            }
                            state.info.host = res[1].substring(0, index);
                            state.info.basePath = res[1].substring(index);
                        }
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
                var baseTypeNames = [];

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

                    var keyProperty = null;
                    var parentTypeName = item.name;

                    if (item.properties) {
                        visitor.visitArr(item.properties, function (item) {
                            if (!item.operationType) {
                                var swType = getSwaggerType(item.type, item.isCollection);
                                var propertyType;
                                if (swType.type) {
                                    propertyType = {type: swType.type};
                                    if (swType.format)
                                        propertyType.format = swType.format;
                                    if (swType.items)
                                        propertyType.items = swType.items;
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

                                    if (!item.isNullable)
                                    {
                                        if (!type.required)
                                        {
                                            type.required = [];
                                        }

                                        type.required.push(item.name);
                                    }
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
                                    var temp;
                                    var routes;
                                    if ('Action' === item.type) {
                                        temp = routeOperation(item.name, item.type, item.operationType, item.params, parentTypeName, swKey, item.returns);
                                        routes = {
                                            'post': temp.route
                                        };
                                        boundOpPaths[temp.path] = routes;
                                    } else if ('Function' === item.type) {
                                        temp = routeOperation(item.name, item.type, item.operationType, item.params, parentTypeName, swKey, item.returns);
                                        routes = {
                                            'get': temp.route
                                        };
                                        boundOpPaths[temp.path] = routes;
                                    }
                                }
                            }
                        });
                    }

                    this.visitObj(item, {
                        'members': function (obj) {
                            type.type = 'string';
                            type['enum'] = [];
                            delete type.properties;
                            this.visitArr(obj, function (obj) {
                                type['enum'].push(handleMember(obj));
                            });
                        },
                        'baseType': function (obj) {
                            var typeValue = type;
                            type = {allOf: []};
                            var baseTypeRef = {'$ref': '#/definitions/' + obj};
                            type.allOf.push(baseTypeRef);
                            type.allOf.push(typeValue);

                            var isBaseTypeRegistered = false;
                            for (var k = 0; k < baseTypeNames.length; k++) {
                                if (baseTypeNames[k] == obj)
                                {
                                    isBaseTypeRegistered = true;
                                }
                            }

                            if (!isBaseTypeRegistered)
                            {
                                baseTypeNames.push(obj);
                            }
                        },
                    });

                    state.definitions[item.name] = type;
                });

                function handleBaseType(baseTypeName) {
                    if (!state.definitions[baseTypeName])
                        return;

                    var propertyName = baseTypeName + 'Type';

                    var propertyContent = {
                        'type': 'string'
                    };

                    if (!state.definitions[baseTypeName].allOf)
                    {
                        if (state.definitions[baseTypeName].discriminator)
                            return;

                        state.definitions[baseTypeName].properties[propertyName] = propertyContent;
                        if (!state.definitions[baseTypeName].required)
                            state.definitions[baseTypeName].required = [];
                        state.definitions[baseTypeName].required.push(propertyName);
                        state.definitions[baseTypeName].discriminator = propertyName;
                    } else
                    {
                        for (var j = 0; j < state.definitions[baseTypeName].allOf.length; j++) {
                            if (state.definitions[baseTypeName].allOf[j].properties)
                            {
                                if (state.definitions[baseTypeName].allOf[j].discriminator)
                                    return;

                                state.definitions[baseTypeName].allOf[j].properties[propertyName] = propertyContent;
                                if (!state.definitions[baseTypeName].allOf[j].required)
                                    state.definitions[baseTypeName].allOf[j].required = [];
                                state.definitions[baseTypeName].allOf[j].required.push(propertyName);
                                state.definitions[baseTypeName].allOf[j].discriminator = propertyName;
                                break;
                            }
                        }
                    }


                    return;
                }

                for (var i = 0; i < baseTypeNames.length; i++) {
                    handleBaseType(baseTypeNames[i]);
                }

                baseTypeNames = [];
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