var util = require('util');
var typeMaps = require('./csharpTypeMaps');
var StringHelper = require('../helpers/stringhelper');
var TypesHelper = require('../helpers/typeshelper');

exports.genEnumType = genEnumType;
function genEnumType(enumType) {
    var result = '';
    if (enumType.name) {
        var typeName = StringHelper.capitalizeInitial(enumType.name);
        result += util.format('[global::Microsoft.OData.Client.OriginalNameAttribute("%s")]', typeName) + '\n';
        result += util.format('public enum %s', typeName);
        if (enumType.underlyingType) {
            result += util.format(': %s\n{\n', typeMaps.MapType(enumType.underlyingType).type);
        } else {
            result += '\n{\n';
        }

        if (enumType.members) {
            for (var i in enumType.members) {
                if (enumType.members[i].name) {
                    var memberName = StringHelper.capitalizeInitial(enumType.members[i].name);
                    result += util.format('[global::Microsoft.OData.Client.OriginalNameAttribute("%s")]', memberName) + '\n';
                    result += memberName;
                    if (enumType.members[i].value !== undefined) {
                        result += util.format(' = %s,', enumType.members[i].value);
                    } else {
                        result += ',';
                    }

                    if (i == enumType.members.length - 1) {
                        result = result.substring(0, result.length - 1) + '\n';
                    } else {
                        result += '\n';
                    }
                }
            }
        }
        result += '}\n\n';
    }

    return result;
}

exports.genByKey = genByKey;
function genByKey(types, namespaceName) {
    var result = '';
    
    for (var j = 0; j < types.length; j++) 
    {
        var type = types[j];
        
        if( type.properties )
        {
            if(TypesHelper.HasKeyProperty(type, types))
            {
                var entityTypeName = StringHelper.excapeKeyword(type.name);
                
                var entityFullName = namespaceName + '.' + StringHelper.capitalizeInitial(type.name);
                
                var entityFullNameSingle = entityFullName + 'Single';
                
                var keyProperties = [];
                TypesHelper.GetKeyProperties(type, types, keyProperties);
                
                var keyComments = '';
                var keyParamList = '';
                var keyDictionary = '';
                
                for(var k = 0; k < keyProperties.length; k++)
                {
                    var keyName = StringHelper.excapeKeyword(keyProperties[k].name);
                    keyComments += util.format('\
        /// <param name="%s">The value of %s</param>\n', keyName, keyName);
                    if(k === 0)
                    {
                        keyParamList +=',\n\
            ';
                    }
                    else
                    {
                        keyParamList +=', ';
                        keyDictionary +=',\n';
                    }
                    keyParamList += util.format('%s %s', TypesHelper.GetTypeDefString(keyProperties[k], namespaceName, types), keyName);
                    keyDictionary += util.format('                { "%s", %s }', StringHelper.capitalizeInitial(keyName), keyName);
                }
                
                result += util.format('\
        /// <summary>\n\
        /// Get an entity of type global::%s as global::%s specified by key from an entity set\n\
        /// </summary>\n\
        /// <param name="source">source entity set</param>\n\
        /// <param name="keys">dictionary with the names and values of keys</param>\n\
        public static global::%s ByKey(this global::Microsoft.OData.Client.DataServiceQuery<global::%s> source, global::System.Collections.Generic.Dictionary<string, object> keys)\n\
        {\n\
            return new global::%s(source.Context, source.GetKeyPath(global::Microsoft.OData.Client.Serializer.GetKeyString(source.Context, keys)));\n\
        }\n', entityFullName, entityFullNameSingle, entityFullNameSingle, entityFullName, entityFullNameSingle);
        
                result += util.format('\
        /// <summary>\n\
        /// Get an entity of type global::%s as global::%s specified by key from an entity set\n\
        /// </summary>\n\
        /// <param name="source">source entity set</param>\n\
%s\
        public static global::%s ByKey(this global::Microsoft.OData.Client.DataServiceQuery<global::%s> source%s)\n\
        {\n\
            global::System.Collections.Generic.Dictionary<string, object> keys = new global::System.Collections.Generic.Dictionary<string, object>\n\
            {\n\
%s\n\
            };\n\
            return new global::%s(source.Context, source.GetKeyPath(global::Microsoft.OData.Client.Serializer.GetKeyString(source.Context, keys)));\n\
        }\n', entityFullName, entityFullNameSingle, keyComments, entityFullNameSingle, entityFullName, keyParamList, keyDictionary, entityFullNameSingle);
            }
        }
    }

    return result;
}

exports.codegen = codegen;
function codegen(jObj, namespaceName) {
    var result = '';
    if (jObj.api) {
        var api = jObj.api;
        result += '/*------------------------------------------------------------\n';
        if (api.name) {
            result += util.format(' * Name: %s\n', api.name);
        }
        if (api.version) {
            if (api.version.current) {
                result += util.format(' * Version: %s\n', api.version.current);
            }
        }
        if (api.description) {
            result += util.format(' * Description: %s\n', api.description);
        }
        if (api.conformance) {
            result += util.format(' * Conformance-Level: %s\n', api.conformance);
        }
        if (api.supportsFilterFunctions) {
            var temp = '';
            for (var i in api.supportsFilterFunctions) {
                temp += api.supportsFilterFunctions[i] + ', ';
            }
            temp = temp.substring(0, temp.length - 2);
            result += util.format(' * Support-Filter-Functions: %s\n', temp);
        }
        result += '------------------------------------------------------------*/\n';
    }

    result += util.format('namespace %s\n{\n', namespaceName);
    if (jObj.types) {
        for (var j in jObj.types) {
            var type = jObj.types[j];
            if (type.members) {
                result += genEnumType(type);
            }
        }
    }

    result +='\
    /// <summary>\n\
    /// Class containing all extension methods\n\
    /// </summary>\n\
    public static class ExtensionMethods\n\
    {\n';
    result += genByKey(jObj.types, namespaceName);
    result +='    }\n';//End of ExtensionMethods
    
    result += '}\n';

    return result;
}

exports.CodegenByObj = function (jObj, namespaceName) {
    return codegen(jObj, namespaceName);
};

exports.Codegen = function (jsonMetadata, namespaceName) {
    var jObj = JSON.parse(jsonMetadata);

    return codegen(jObj, namespaceName);
};