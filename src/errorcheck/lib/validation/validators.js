/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Apigee Corporation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var _ = require('lodash');
var helpers = require('../helpers');
var JsonRefs = require('json-refs');
var simpleYAMLSchema = require('./simpleYAML-schema');

function walkSchema (api, blacklist, schema, path, handlers, response) {
  var type = schema.type || 'object';

  function shouldSkip (cPath) {
    return _.indexOf(blacklist, JsonRefs.pathToPtr(cPath)) > -1;
  }

  // Do not process items in the blacklist as they've been processed already
  if (shouldSkip(path)) {
    return;
  }

  function walker (pSchema, pPath) {
    // Do not process items in the blacklist as they've been processed already
    if (shouldSkip(pPath)) {
      return;
    }

    _.forEach(pSchema, function (item, name) {
      if (_.isNumber(name)) {
        name = name.toString();
      }

      walkSchema(api, blacklist, item, pPath.concat(name), handlers, response);
    });
  }

  if (!_.isUndefined(schema.schema)) {
    walkSchema(api, blacklist, schema.schema, path.concat('schema'), handlers, response);
  } else if (type === 'array' && !_.isUndefined(schema.items)) {
    if (_.isArray(schema.items)) {
      walker(schema.items, path.concat('items'));
    } else {
      walkSchema(api, blacklist, schema.items, path.concat('items'), handlers, response);
    }
  } else if (type === 'object') {
    if (!_.isUndefined(schema.additionalProperties)) {
      walkSchema(api, blacklist, schema.additionalProperties, path.concat('additionalProperties'), handlers, response);
    }

    _.forEach(['allOf', 'properties'], function (propName) {
      if (!_.isUndefined(schema[propName])) {
        walker(schema[propName], path.concat(propName));
      }
    });
  }

  _.forEach(handlers, function (handler) {
    handler(api, response, schema, path);
  });
}

/**
 * Validates the resolved Swagger document against the Swagger 2.0 JSON Schema.
 *
 * @param {SwaggerApi} api - The SwaggerApi object
 *
 * @returns {object} Object containing the errors and warnings of the validation
 */
function validateStructure (api) {
  var results = helpers.validateAgainstSchema(helpers.getJSONSchemaValidator(), simpleYAMLSchema, api.definitionFullyResolved);

  // Make complex JSON Schema validation errors easier to understand (Issue 15)
  results.errors = results.errors.map(function (error) {
    var defType = ['additionalProperties', 'items'].indexOf(error.path[error.path.length - 1]) > -1 ?
          'schema' :
          error.path[error.path.length - 2];

    if (['ANY_OF_MISSING', 'ONE_OF_MISSING'].indexOf(error.code) > -1) {
      switch (defType) {
      case 'parameters':
        defType = 'parameter';
        break;

      case 'responses':
        defType = 'response';
        break;

      case 'schema':
        defType += ' ' + error.path[error.path.length - 1];

        // no default
      }

      error.message = 'Not a valid ' + defType + ' definition';
    }

    return error;
  });

  // Treat invalid/missing references as structural errors
  _.each(api.references, function (refDetails, refPtr) {
    var refPath = JsonRefs.pathFromPtr(refPtr);
    var err;

    if (refDetails.missing) {
      err = {
        code: 'UNRESOLVABLE_REFERENCE',
        message: 'Reference could not be resolved: ' + refDetails.uri,
        path: refPath.concat('$ref')
      };

      if (_.has(refDetails, 'error')) {
        err.error = refDetails.error;
      }

      results.errors.push(err);
    } else if (refDetails.type === 'invalid') {
      results.errors.push({
        code: 'INVALID_REFERENCE',
        message: refDetails.error || 'Invalid JSON Reference',
        path: refPath.concat('$ref')
      });
    } else if (_.has(refDetails, 'warning')) {
      // json-refs only creates warnings for JSON References with superfluous properties which will be ignored
      results.warnings.push({
        code: 'EXTRA_REFERENCE_PROPERTIES',
        message: refDetails.warning,
        path: refPath
      });
    }
  });

  return results;
}

function getTypeProperties(api, type)
{
  var result=[];
  _.forEach(['key', 'requiredProperties', 'optionalProperties'], function(member){
      if(_.isString(type[member])) { 
        result.push(type[member]); return;
      };

      if (!_.isArray(type[member])) return;
  
      _.forEach(type[member], function(property){
        if(_.isString(property)) {result.push(property); return;}
        result.push(property.name);
      });
  });

  if(!!type['baseType'])
  {
    _.forEach(api.definitionFullyResolved.types, function(t){
      if(t.name==type['baseType'])
      {
        result.concat(getTypeProperties(api, t));
      }
    });
  }

  return result;
}

function isEntityType(api, typeName)
{
  var returnValue=false;
  _.forEach(api.definitionFullyResolved.types, function(type){
    if(type.name==typeName)
    {
      returnValue = !!type.key || (!!type.baseType && isEntityType(api, type.baseType));
    }
  });

  return returnValue;
}

function trimLeft(origin, string)
{
  if(_.startsWith(origin, string))
  { 
    return origin.slice(string.length);
  }
  return origin;
}

function trimRight(origin, string)
{
  if(_.endsWith(origin, string))
  { 
    return origin.slice(0,-string.length);
  }
  return origin;
}

function validateSimpleYamlTypereferences(api)
{
  var response = {
    errors: [],
    warnings: []
  };

  var types={};
  _.forEach(api.definitionFullyResolved.types, function(type){
     types[type.name] = [];
     types[type.name] = types[type.name].concat(getTypeProperties(api, type));
  });

  var customTypes=_.keys(types);

  var primitiveTypes = [
    'binary',
    'bool',
    'boolean',
    'byte',
    'date',
    'datetimeoffset',
    'decimal',
    'double',
    'duration',
    'guid',
    'int16',
    'int32',
    'int64',
    'short',
    'int',
    'long',
    'sbyte',
    'single',
    'stream',
    'string',
    'timeofday',
    'geography',
    'geographypoint',
    'geographylinestring',
    'geographypolygon',
    'geographymultipoint',
    'geographymultilinestring',
    'geographymultipolygon',
    'geographycollection',
    'geometry',
    'geometrypoint',
    'geometrylinestring',
    'geometrypolygon',
    'geometrymultipoint',
    'geometryMultiLinestring',
    'geometrymultipolygon',
    'geometrycollection'
  ];

  _.forEach(api.definitionFullyResolved.root, function(service, index){
    if(service.type){

      // validate the type is resolvable.
      var typeName =trimRight(service.type, '[]');
      if(!_.includes(customTypes, typeName))
      {
        response.errors.push({
          code: 'UNRESOLVABLE_REFERENCE',
          message:  'Cannot find the definition for type: ' + typeName,
          path: ['root', index, 'type']
        });
      } else {

        if(!isEntityType(api, typeName))
        {
          response.errors.push({
            code: 'INVALID_TYPE',
            message: 'The definition of  '+typeName+' does not have key.',
            path: ['root', index, 'type']
          });
        }

        // validate the properties: 'concurrencyProperties', 'disallowNavigation', 'disallowInsert'
        var referenceProperties=['concurrencyProperties', 'disallowNavigation', 'disallowInsert'];
        _.forEach(referenceProperties,function(refprop){

          if(_.isString(service[refprop])){
            if(!_.includes(types[typeName], service[refprop]))
            {
              response.errors.push({
                code: 'UNRESOLVABLE_REFERENCE',
                message: 'Cannot find the property ' + service[refprop] + ' in type '+typeName+'.',
                path: ['root', index, refprop]
              });
            }
            return;
          }

          _.forEach(service[refprop],function(propName){
            if(!_.includes(types[typeName], propName))
            {
              response.errors.push({
                code: 'UNRESOLVABLE_REFERENCE',
                message: 'Cannot find the property ' + propName + ' in type '+typeName+'.',
                path: ['root', index, refprop]
              });
            }
          });
        });
      }
    } 

    if(service.params && _.isArray(service.params)) {
       _.forEach(service.params, function(param, index2){
        if(_.isObject(param) && param.type)
        {
          var typeName =trimRight(param.type, '[]');
          if(!_.includes(customTypes, typeName) && !_.includes(primitiveTypes, trimLeft(typeName.toLowerCase(), 'edm.')))
          {
            response.errors.push({
              code: 'INVALID_TYPE',
              message: typeName + ' is not a primitive type and cannot find its definition in types',
              path: ['root', index, 'params', index2, 'type']
            });
          }
        }
       });
    }

    if(service.returns){
      var typeName =trimRight(service.returns, '[]');
      if(!_.includes(customTypes, typeName) && !_.includes(primitiveTypes, trimLeft(typeName.toLowerCase(), 'edm.')))
      {
        response.errors.push({
          code: 'INVALID_TYPE',
          message: typeName + ' is not a primitive type and cannot find its definition in types',
          path: ['root', index, 'returns']
        });
      }
    }
  });

  _.forEach(api.definitionFullyResolved.types, function(typeDef, index){
    if(typeDef.baseType)
    {
      if(!_.includes(customTypes, typeDef.baseType))
      {
        response.errors.push({
          code: 'INVALID_TYPE',
          message: 'Cannot find the definition for '+ typeDef.baseType +' in types.',
          path: ['types', index, 'baseType']
        });
      }
    }
    var propMems=['key', 'requiredProperties', 'optionalProperties'];
    _.forEach(propMems, function(propMem){
      if(typeDef[propMem]&&_.isArray(typeDef[propMem]))
      {
        _.forEach(typeDef[propMem],function(prop, index2){
          if(_.isObject(prop) && !!prop.type
              && !_.includes(customTypes, trimRight(prop.type,'[]'))
              && !_.includes(primitiveTypes, trimLeft(trimRight(prop.type,'[]').toLowerCase(),'edm.'))
            )
          {
            response.errors.push({
              code: 'INVALID_TYPE',
              message: 'Cannot find the definition for '+ prop.type +' in types.',
              path: ['types', index, propMem, index2, 'type']
            });
          }
        });
      }
    });


    if(typeDef.operations&& _.isArray(typeDef.operations)){
      _.forEach(typeDef.operations, function(operation, index2){
       if(operation.params 
          &&_.isArray(operation.params))
        {
          _.forEach(operation.params,function(parameter, index3)
            {
               if(parameter.type 
                && !_.includes(customTypes,trimRight(parameter.type, '[]'))
                && !_.includes(primitiveTypes, trimLeft(trimRight(parameter.type, '[]').toLowerCase(),'edm.')))
                {
                  response.errors.push({
                    code: 'INVALID_TYPE',
                    message: parameter.type + ' is not a primitive type and cannot find its definition in types',
                    path: ['types', index, 'operations', index2, 'params', index3, 'type']
                  });
               }
            });
        }

      if(operation.returns
        && !_.includes(customTypes,trimRight(operation.returns, '[]'))
        && !_.includes(primitiveTypes,trimLeft(trimRight(operation.returns, '[]').toLowerCase(),'edm.')))
      {
          response.errors.push({
            code: 'INVALID_TYPE',
            message: operation.returns + ' is not a primitive type and cannot find its definition in types',
            path: ['types', index, 'operations', index2, 'returns']
          });
      }
       
      });
    }
  }); 
  
  return response;
}

function validateSimpleYamlnamespace(api)
{
  var response = {
    errors: [],
    warnings: []
  };

  if(!api.definitionFullyResolved.api.namespace)
    {return response;}
  switch(api.definitionFullyResolved.api.namespace)
  {
    case 'Edm':
    case 'odata':
    case 'Synstem':
    case 'Transient':
        response.errors.push({
          code: 'UNALLOWED_VALUE',
          message:  'The namespace must not use the reserved values Edm, odata, System, or Transient.',
          path: ['api', 'namespace']
        });
  }
  return response;
}

module.exports = {
  jsonSchemaValidator: validateStructure,
  semanticValidators: [
  validateSimpleYamlTypereferences,
  validateSimpleYamlnamespace
  ]
};
