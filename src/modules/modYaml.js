function fromYaml(str, errors, config) {
    var obj;
    try {
        obj = jsyaml.load(str);
    }
    catch (err) {
        errors.push({
            line: err.mark.line,
            message: err.reason
        });
        return null;
    }

    var typeMap =
    {
        'binary': 'Binary',
        'bool': 'Boolean',
        'byte': 'Byte',
        'date': 'Date',
        'dateTimeOffset': 'DateTimeOffset',
        'decimal': 'Decimal',
        'double': 'Double',
        'duration': 'Duration',
        'guid': 'Guid',
        'short': 'Int16',
        'int16': 'Int16',
        'int': 'Int32',
        'int32': 'Int32',
        'long': 'Int64',
        'int64': 'Int64',
        'sbyte': 'SByte',
        'single': 'Single',
        'stream': 'Stream',
        'string': 'String',
        'timeOfDay': 'TimeOfDay',
    };

    function detectCollectionType(yamlType) {
        var type, col;

        if (yamlType[yamlType.length - 1] === ']') {
            type = yamlType.substr(0, yamlType.length - 2);
            col = true;
        } else {
            type = yamlType;
            col = false;
        }

        return {
            'type': type,
            'isCol': col
        };
    }

    function parseParams(arr) {
        var tempArr = [];
        if (Array.isArray(arr)) {
            for (var i in arr) {
                var tempObj = {};
                if (arr[i].name && arr[i].type) {
                    tempObj = {
                        'name': arr[i].name,
                        'type': typeMap[arr[i].type] || arr[i].type
                    };
                }
                else if (arr[i].name && !arr[i].type) {
                    tempObj = {
                        'name': arr[i].name,
                        'type': 'String'
                    };
                }
                else {
                    tempObj = {
                        'name': arr[i],
                        'type': 'String'
                    };
                }
                tempArr.push(tempObj);
            }
        }
        else {
            var tempObj = {
                'name': arr,
                'type': 'String'
            };
            tempArr.push(tempObj);
        }
        return tempArr;
    }

    function parseRoot(arr) {
        var entitysets = [];
        var singletons = [];
        var operations = [];

        this.visitArr(arr, function (item) {
            if (!item.type) {
                var operation = {};
                if (!item.returns) {
                    operation.type = 'Action';
                }
                else {
                    operation.type = 'Function';
                }
                operation.operationType = 'Unbound';
                this.visitObj(item, {
                    'name': function (obj) {
                        operation.name = obj;
                    },
                    'params': function (arr) {
                        operation.params = parseParams(arr);
                    },
                    'returns': function (obj) {
                        if (obj) {
                            operation.returns = typeMap[obj] || obj;
                        }
                    }
                });
                operations.push(operation);
            }
            else {
                // entityset or singleton
                var mt = detectCollectionType(item.type);
                var et = {
                    name: item.name,
                    type: mt.type,
                    allows: item.allows
                };

                if (mt.isCol) {
                    entitysets.push(et);
                }
                else {
                    singletons.push(et);
                }
            }
        });

        state.container = {};
        if (entitysets.length > 0)state.container.entitysets = entitysets;
        if (singletons.length > 0)state.container.singletons = singletons;
        if (operations.length > 0)state.container.operations = operations;
    }

    var visitor = this.getVisitor();
    var state = {};
    visitor.visitObj(obj, {
        'service': function (obj) {
            state.service = obj;
        },
        'types': function (arr) {
            state.types = [];
            this.visitArr(arr, function (item) {
                function handleProperty(obj, extend) {
                    var property;
                    if (typeof obj === 'string') {
                        property = {'name': obj};
                    } else {
                        property = {'name': obj.name};
                        if (obj.type) {
                            var typeInfo = detectCollectionType(obj.type);
                            property.type = typeMap[typeInfo.type] || typeInfo.type;
                            if (typeInfo.isCol) {
                                property.isCollection = typeInfo.isCol;
                            }
                        }
                    }

                    if (extend) extend(property);

                    return property;
                }

                function handleMember(obj) {
                    var member;

                    if (typeof obj === 'string') {
                        member = {'name': obj};
                    } else {
                        member = {'name': obj.name};
                        if (obj.value >= 0 || obj.value < 0) {
                            member.value = obj.value;
                        }
                    }

                    return member;
                }

                function handleOperation(obj) {
                    var operation;
                    if (obj.name) {
                        operation = {'name': obj.name};

                        // Parse type of an operation.
                        if (!obj.returns) {
                            operation.type = 'Action';
                        }
                        else {
                            operation.type = 'Function';
                        }

                        // Parse parameters.
                        if (obj.params) {
                            operation.params = parseParams(obj.params);
                        }

                        // Parse return type.
                        if (obj.returns) {
                            operation.returns = typeMap[obj.returns] || obj.returns;
                        }

                        // Parse operation-type (Bound/Unbound).
                        operation.operationType = 'Bound';
                    }
                    return operation;
                }


                var type = {properties: []};
                this.visitObj(item, {
                    'name': function (obj) {
                        type.name = obj;
                    },
                    'members': function (obj) {
                        type.members = [];
                        delete type.properties;
                        this.visitArr(obj, function (obj) {
                            type.members.push(handleMember(obj));
                        });
                    },
                    'flags': function (obj) {
                        type.flags = obj;
                    },
                    'underlyingType': function (obj) {
                        type.underlyingType = obj;
                    },
                    'key': function (obj) {
                        this.visitArr(obj, function (obj) {
                            type.properties.push(handleProperty(obj, function (p) {
                                p.isKey = true;
                            }));
                        });
                    },
                    'requiredProperties': function (obj) {
                        this.visitArr(obj, function (obj) {
                            type.properties.push(handleProperty(obj));
                        });
                    },
                    'optionalProperties': function (obj) {
                        this.visitArr(obj, function (obj) {
                            type.properties.push(handleProperty(obj, function (p) {
                                p.isNullable = true;
                            }));
                        });
                    },
                    'operations': function (obj) {
                        this.visitArr(obj, function (obj) {
                            var operation = handleOperation(obj);
                            if (operation) {
                                type.properties.push(operation);
                            }
                        });
                    }
                });
                state.types.push(type);
            });
        },
        'root': parseRoot,
        'serviceRoot': parseRoot
    });

    if (config.addDefaults) {
        Morpho.addDefaults(state);
    }

    return state;
}

Morpho.registerFrom('yaml', fromYaml);