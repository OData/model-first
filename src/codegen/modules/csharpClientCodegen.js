var util = require('util');
var typeMaps = require('./csharpTypeMaps');
var StringHelper = require('../helpers/stringhelper');

exports.genEnumType = genEnumType;
function genEnumType(enumType) {
    var result = '';
    if (enumType.name) {
        var typeName = StringHelper.capitalizeInitial(enumType.name);
        result += util.format('[global::Microsoft.OData.Client.OriginalNameAttribute("%s")]', typeName) + '\n';
        result += util.format('public enum %s', typeName);
        if (enumType.underlyingType) {
            result += util.format(': %s\n{\n', typeMaps.MapType(enumType.underlyingType));
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