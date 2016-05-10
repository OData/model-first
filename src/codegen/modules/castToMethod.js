var _ = require('lodash');
var config = require('../config');

var CastToMethod='\
        /// <summary>\n\
        /// Cast an entity of type {0} to its derived type {2}\n\
        /// </summary>\n\
        /// <param name="source">source entity</param>\n\
        public static {3} CastTo{1}(this global::Microsoft.OData.Client.DataServiceQuerySingle<{0}> source)\n\
        {\n\
            global::Microsoft.OData.Client.DataServiceQuerySingle<{2}> query = source.CastTo<{2}>();\n\
            return new {3}(source.Context, query.GetPath(null));\n\
        }\n';

exports.generateCastTo = gnerate;
function gnerate(model, namespaceName)
{ 
    var result='';
    for(var i=0;i<model.types.length;i++)
    {
        var entityType = model.types[i];
        var current = entityType.baseType;
        while (current !== undefined && current !== '' && isEntityType(model, current))
        {
            var baseTypeName = current;
            baseTypeName = GetPrefixedFullName(namespaceName, GetFixedName(CustomizeNaming(baseTypeName)));
            var entityTypeFullName = GetPrefixedFullName(namespaceName, GetFixedName(CustomizeNaming(entityType.name)));
            var returnTypeName = GetPrefixedFullName(namespaceName, GetFixedName(CustomizeNaming(entityType.name) + 'Single'));
            result+=CastToMethod.format(baseTypeName, CustomizeNaming(entityType.name), entityTypeFullName, returnTypeName);
            
            baseTypeName = current;
            current = undefined;
            for(var j=0;j<model.types.length;j++){
                if(model.types[j].name === baseTypeName && !!model.types[j].baseType){
                    current = model.types[j].baseType;
                }
            }
        }
    }
    return result;
}

function GetPrefixedFullName(namespace, fixedName)
{
    return 'global::' + namespace + '.' +fixedName;
}

var LanguageKeywords = [
    'abstract', 'as', 'base', 'byte', 'bool', 'break', 'case', 'catch', 'char', 'checked', 'class', 'const', 'continue',
    'decimal', 'default', 'delegate', 'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'false', 'for',
    'foreach', 'finally', 'fixed', 'float', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock',
    'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params', 'private', 'protected', 'public',
    'readonly', 'ref', 'return', 'sbyte', 'sealed', 'string', 'short', 'sizeof', 'stackalloc', 'static', 'struct', 'switch',
    'this', 'throw', 'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'virtual', 'volatile',
    'void', 'while'];

function GetFixedName(originalName)
{
    var fixedName = originalName;

    if (_.includes(LanguageKeywords,fixedName))
    {
        fixedName = '@' + fixedName;
    }

    return fixedName;
}

function isEntityType(model, typeName)
{
    var returnValue=false;
    for (var i=0; i<model.types.length; i++)
    {
        if(model.types[i].name != typeName)
        {
            continue;
        }

        for(var j=0;j< model.types[i].properties.length;j++)
        {
            if(!!(model.types[i].properties[j].isKey))
            { returnValue = true; break; }
        }
        if(returnValue) {
            break;
        } else {
            if(model.types[i].baseType)
            {
                return isEntityType(model, model.types[i].baseType);
            }
        }
    }

    return returnValue;
}

exports.CustomizeNaming=CustomizeNaming;
function CustomizeNaming(name){
    if(name.length===1)
    {
        return name[0].toUpperCase();
    } else if(name.length > 1){
        return name[0].toUpperCase() + name.substr(1);
    }
}
