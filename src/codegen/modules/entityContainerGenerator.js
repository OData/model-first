var _=require('lodash');
var config = require('../config');

var knownIdentifiers=[];

var LanguageKeywords = [
    'abstract', 'as', 'base', 'byte', 'bool', 'break', 'case', 'catch', 'char', 'checked', 'class', 'const', 'continue',
    'decimal', 'default', 'delegate', 'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'false', 'for',
    'foreach', 'finally', 'fixed', 'float', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock',
    'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params', 'private', 'protected', 'public',
    'readonly', 'ref', 'return', 'sbyte', 'sealed', 'string', 'short', 'sizeof', 'stackalloc', 'static', 'struct', 'switch',
    'this', 'throw', 'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'virtual', 'volatile',
    'void', 'while'];

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'? args[number] : match;
        });
    };
}

// Simple YAML Bugs
var EntityContainer=config.Constants.Code.EntityContainer;
var fullNamespace='Default.Namespace.IfNoNamespaceField'; //The value for test case, if the JSON model does not have api part or name and namespace fields both missing in api part.

// Need user configure or we got from the ymal?
var languageDependentNamespace= '';

var ModelHasInheritance = true;

var UseDataServiceCollection = true;

var noComments='\
    /// <summary>\n\
    /// There are no comments for {0} in the schema.\n\
    /// </summary>\n';

var originalNameAttribute='\
    [global::Microsoft.OData.Client.OriginalNameAttribute("{0}")]\n';

var containerClass='\
    public partial class {0} : global::Microsoft.OData.Client.DataServiceContext\n\
    {\n';

var containerConstructorComment = '\
        /// <summary>\n\
        /// Initialize a new {0} object.\n\
        /// </summary>\n';

var generatedCodeAttribute='\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData Client.Design.T4", "2.4.0")]\n';

var containerConstructor='\
        public {0}(global::System.Uri serviceRoot) : \n\
                base(serviceRoot, global::Microsoft.OData.Client.ODataProtocolVersion.V4)\n\
        {\n\
            this.ResolveName = new global::System.Func<global::System.Type, string>(this.ResolveNameFromType);\n\
            this.ResolveType = new global::System.Func<string, global::System.Type>(this.ResolveTypeFromName);\n\
            this.OnContextCreated();\n\
        }\n';

var onContextCreated='\
        partial void OnContextCreated();\n';

var resolveTypeFromNameComment='\
        /// <summary>\n\
        /// Since the namespace configured for this service reference\n\
        /// in Visual Studio is different from the one indicated in the\n\
        /// server schema, use type-mappers to map between the two.\n\
        /// </summary>\n';

var ResolveTypeFromName='\
        protected global::System.Type ResolveTypeFromName(string typeName)\n\
        {\n\
            global::System.Type resolvedType = this.DefaultResolveType(typeName, "{0}", "{1}");\n\
            if ((resolvedType != null))\n\
            {\n\
                return resolvedType;\n\
            }\n\
            return null;\n\
        }\n';

var StartForResolveNameFromType='\
        /// <summary>\n\
        /// Since the namespace configured for this service reference\n\
        /// in Visual Studio is different from the one indicated in the\n\
        /// server schema, use type-mappers to map between the two.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        protected string ResolveNameFromType(global::System.Type clientType)\n\
        {\n\
            global::Microsoft.OData.Client.OriginalNameAttribute originalNameAttribute = (global::Microsoft.OData.Client.OriginalNameAttribute)global::System.Linq.Enumerable.SingleOrDefault(global::Microsoft.OData.Client.Utility.GetCustomAttributes(clientType, typeof(global::Microsoft.OData.Client.OriginalNameAttribute), true));\n';

var ResolveNameFromType = '\
            if (clientType.Namespace.Equals("{0}", global::System.StringComparison.Ordinal))\n\
            {\n\
                if (originalNameAttribute != null)\n\
                {\n\
                    return string.Concat("{1}.", originalNameAttribute.OriginalName);\n\
                }\n\
                return string.Concat("{1}.", clientType.Name);\n\
            }\n';

var EndForResolveNameFromType = '\
            if (originalNameAttribute != null)\n\
            {\n\
                return clientType.Namespace + "." + originalNameAttribute.OriginalName;\n\
            }\n\
            return {0};\n\
        }\n';

var EntitySetProperty = '\
        /// <summary>\n\
        /// There are no comments for {0} in the schema.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("{1}")]\n\
        public global::Microsoft.OData.Client.DataServiceQuery<{2}> {0}\n\
        {\n\
            get\n\
            {\n\
                if ((this._{0} == null))\n\
                {\n\
                    this._{0} = base.CreateQuery<{2}>("{0}");\n\
                }\n\
                return this._{0};\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        private global::Microsoft.OData.Client.DataServiceQuery<{2}> _{0};\n';

var AddToEntitySetMethod='\
        /// <summary>\n\
        /// There are no comments for {0} in the schema.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        public void AddTo{0}({1} {2})\n\
        {\n\
            base.AddObject("{0}", {2});\n\
        }\n';

var SingletonProperty='\
        /// <summary>\n\
        /// There are no comments for {0} in the schema.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("{1}")]\n\
        public {3} {2}\n\
        {\n\
            get\n\
            {\n\
                if ((this._{0} == null))\n\
                {\n\
                    this._{0} = new {3}(this, "{1}");\n\
                }\n\
                return this._{0};\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        private {3} _{0};\n';

var FunctionImportReturnCollectionResult='\
        /// <summary>\n\
        /// There are no comments for {0} in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("{1}")]\n\
        public global::Microsoft.OData.Client.DataServiceQuery<{2}> {0}({3}{6})\n\
        {\n\
            return this.CreateFunctionQuery<{2}>("", "{1}", {5}{4});\n\
        }\n';

var FunctionImportReturnSingleResult='\
        /// <summary>\n\
        /// There are no comments for {0} in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("{1}")]\n\
        public {2} {0}({6}{9})\n\
        {\n\
            return {3}this.CreateFunctionQuerySingle<{5}>("", "{1}", {8}{7}){4};\n\
        }\n';

var ActionImport='\
        /// <summary>\n\
        /// There are no comments for {0} in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("{1}")]\n\
        public {2} {0}({3})\n\
        {\n\
            return new {2}(this, this.BaseUri.OriginalString.Trim(\'/\') + "{1}"{4});\n\
        }\n';

var BodyOperationParameterConstructor = 'new global::Microsoft.OData.Client.BodyOperationParameter(\"{0}\", {1})';
var UriEntityOperationParameterConstructor = 'new global::Microsoft.OData.Client.UriEntityOperationParameter(\"{0}\", {1}, {2})';
var UriOperationParameterConstructor = 'new global::Microsoft.OData.Client.UriOperationParameter(\"{0}\", {1})';


var ClassEndForEntityContainer='\
    }\n';

var TypeofFormatter='typeof({0})';

exports.generate = generateEntityContainer;
function generateEntityContainer(model, namespaceName){
    languageDependentNamespace=namespaceName;
    if(!!model.api.namespace)
    {
        fullNamespace = model.api.namespace;
    }

    var result = '';
    result += noComments.format(CustomizeNaming(EntityContainer));
    result += originalNameAttribute.format(EntityContainer);
    result += containerClass.format(CustomizeNaming(EntityContainer));
    result += containerConstructorComment.format(CustomizeNaming(EntityContainer));
    result += generatedCodeAttribute;
    result += containerConstructor.format(CustomizeNaming(EntityContainer));
    result += onContextCreated;

    result += resolveTypeFromNameComment;
    result += generatedCodeAttribute;
    result += ResolveTypeFromName.format(fullNamespace, languageDependentNamespace);
    
    result += StartForResolveNameFromType;
    result += ResolveNameFromType.format(languageDependentNamespace, fullNamespace);
    result += EndForResolveNameFromType.format(ModelHasInheritance?'clientType.FullName':'null');
    
   // Write EntitySets
    var entitysets=[];
    var singletons=[];
    var functions=[];
    var actions=[];
    if(!!model.container.operations){
        model.container.operations.forEach(function(element){
            if(element.returns){
                functions = functions.concat(element);
            } else {
                actions = actions.concat(element);
            }
        });
    } 

    if(!!model.container.entitysets){
        model.container.entitysets.forEach(function(element){
            if(element.name.indexOf("/")!==-1)
            {
                return;
            }
            result += EntitySetProperty.format(CustomizeNaming(element.name), element.name, CustomizeNaming(element.type));
        });
    }

    // Write AddTo methods
    if(!!model.container.entitysets){
        model.container.entitysets.forEach(function(element){
            if(element.name.indexOf("/")!==-1)
            {
                return;
            }
            result += AddToEntitySetMethod.format(CustomizeNaming(element.name), CustomizeNaming(element.type), GetUniqueParameterName(element.type));
        });
    }
    // Write Singletons
    if(!!model.container.singletons){
        model.container.singletons.forEach(function(element){
            result += SingletonProperty.format(CustomizeNaming(element.name), element.name, GetFixedName(CustomizeNaming(element.name)), CustomizeNaming(element.type) + 'Single');
        });
    }

    functions.forEach(function(element){
        var isReference = false;
        if(_.includes(clrReferenceTypes, element.returns.type) || isComplexOrEntityType(model, element.returns.type))
        { isReference = true; }
        if(isEntityType(model, element.returns.type))
        {
            element.returns.isEntity = true;
        }

        var returnTypeName = GetClrTypeName(element.returns, isReference);
        
        var paramResult = {};
        GetParameterStrings(false, false, element.params, paramResult, model);

        if(element.returns.isCollection)
        {
            result += FunctionImportReturnCollectionResult.format(GetFixedName(CustomizeNaming(element.name)), element.name, returnTypeName, paramResult.parameterString, 
                paramResult.parameterValues === '' ? '' : ', ' + paramResult.parameterValues, (!!element.IsComposable).toString(),
                paramResult.useEntityReference ? ', bool useEntityReference = false' : '');
        }
        else
        {
            var returnType;
            var constructReturnTypeStart;
            var constructReturnTypeEnd;
            if(isEntityType(model, element.returns.type))
            {
                returnType = returnTypeName + 'Single';
                constructReturnTypeStart = 'new ' + returnType + '(';
                constructReturnTypeEnd = ')';
            }
            else
            {
                returnType = 'global::Microsoft.OData.Client.DataServiceQuerySingle<' + returnTypeName + '>';
                constructReturnTypeStart = '';
                constructReturnTypeEnd = '';
            }


            result += FunctionImportReturnSingleResult.format(GetFixedName(CustomizeNaming(element.name)), element.name, returnType, constructReturnTypeStart, constructReturnTypeEnd, returnTypeName,
             paramResult.parameterString, (paramResult.parameterValues === '') ? '' : ', ' + paramResult.parameterValues, (!!element.IsComposable).toString(),
             paramResult.useEntityReference ? ', bool useEntityReference = false' : '');
        }
    });

    actions.forEach(function(element){
        var paramResult = {};
        GetParameterStrings(false, true, element.params, paramResult, model);

        returnTypeName = 'global::Microsoft.OData.Client.DataServiceActionQuery';
        result += ActionImport.format(GetFixedName(CustomizeNaming(element.name)), element.name, returnTypeName, paramResult.parameterString, 
            !!(paramResult.parameterValues) ? ', ' + paramResult.parameterValues : '');
    });

    result += ClassEndForEntityContainer;
    return result;
}

function GetParameterStrings(isBound, isAction, parameters, paramResult, model)
{
    paramResult.parameterString = '';
    paramResult.parameterExpressionString = '';
    paramResult.parameterTypes = '';
    paramResult.parameterValues = '';
    paramResult.useEntityReference = false;

    var n = !!parameters ? parameters.length : 0;
    for (var i = isBound ? 1 : 0; i < n; ++i)
    {
        var param = parameters[i];
        
        var isReference = false;
        if(_.includes(clrReferenceTypes, param.type) || isComplexOrEntityType(model, param.type))
        { isReference = true; }
        if(isEntityType(model, param.type))
        {
            param.isEntity = true;
        }

        var typeName = GetClrTypeName(param, isReference, true);

        paramResult.parameterString += typeName;
        paramResult.parameterString += (' ' + GetFixedName(param.name));
        
        paramResult.parameterString += i == n - 1 ? '' : ', ';
        paramResult.parameterTypes += TypeofFormatter.format(typeName) + ', ';
        
        if (i != (isBound ? 1 : 0))
        {
            paramResult.parameterValues += ',\n                    ';
        }
        
        if (isAction)
        {
            paramResult.parameterValues += BodyOperationParameterConstructor.format(param.name, GetFixedName(param.name));
        }
        else if (isEntityType(model, param.type))
        {
            paramResult.useEntityReference = true;
            paramResult.parameterValues += UriEntityOperationParameterConstructor.format(param.name, GetFixedName(param.name),'useEntityReference');
        }
        else
        {
            paramResult.parameterValues += UriOperationParameterConstructor.format(param.name, GetFixedName(param.name));
        }
    }
}

function isComplexOrEntityType(model, typeName)
{
    var returnValue=false;
    for (i=0; i<model.types.length; i++)
    {
        if(model.types[i].name == typeName && model.types[i].members === undefined)
        {
            returnValue = true; break;
        }
    }

    return returnValue;
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

function GetClrTypeName(edmType, isReference, isOperationParameter)
{
    if(!isReference) isReference = false;
    if(!isOperationParameter) isOperationParameter = false;

    var addNullableTemplate=true;
    if(!!edmType.isCollection)
    {
        addNullableTemplate = false;
    }
    var clrTypeName = GetPrimitiveTypeName(edmType.type);
    if(clrTypeName === 'UNKNOWN')
    {
        // need refine
        clrTypeName = GetPrefixedFullName(languageDependentNamespace, GetFixedName(CustomizeNaming(edmType.type)));

    }

    if(edmType.isNullable && !isReference && addNullableTemplate)
    {
        clrTypeName = 'global::System.Nullable<{0}>'.format(clrTypeName);
    }

    if(!!edmType.isCollection && isOperationParameter)
    {
        clrTypeName = 'global::System.Collections.Generic.ICollection<{0}>'.format(clrTypeName);
    }

    return clrTypeName;
}

function GetUniqueParameterName(name)
{
        name = _.camelCase(name);
        
        // FxCop consider 'iD' as violation, we will change any property that is 'id'(case insensitive) to 'ID'
        if (/^[iI][dD]$/.test(name))
        {
            name = 'ID';
        }

        return GetUniqueIdentifier(name);
}

function GetPrefixedFullName(namespace, fixedName)
{
    return 'global::' + namespace + '.' +fixedName;
}

/// <summary>
/// Given an identifier, makes it unique within the scope by adding
/// a suffix (1, 2, 3, ...), and returns the adjusted identifier.
/// </summary>
/// <param name='identifier'>Identifier. Must not be null or empty.</param>
/// <returns>Identifier adjusted to be unique within the scope.</returns>
function GetUniqueIdentifier(identifier)
{
    // find a unique name by adding suffix as necessary
    var numberOfConflicts = 0;
    var uniqueIdentifier = identifier;
    while (_.includes(knownIdentifiers, identifier))
    {
        ++numberOfConflicts;
        identifier += numberOfConflicts;
    }

    knownIdentifiers.concat(identifier);

    return identifier;
}

function GetFixedName(originalName)
{
    var fixedName = originalName;

    if (_.includes(LanguageKeywords,fixedName))
    {
        fixedName = '@' + fixedName;
    }

    return fixedName;
}

/// <summary>
/// Gets the clr type name from the give Edm primitive type.
/// </summary>
/// <param name='edmPrimitiveType'>The Edm primitive type in question.</param>
/// <param name='clientTemplate'>ODataClientTemplate instance that call this method.</param>
/// <returns>The clr type name of the Edm primitive type.</returns>
function GetPrimitiveTypeName(edmPrimitiveType)
{
    var type='UNKNOWN';
    if (edmPrimitiveType=='edm.int32')
    {
        type= 'int';
    }
    else if (edmPrimitiveType== 'edm.string')
    {
        type= 'string';
    }
    else if (edmPrimitiveType=='edm.binary')
    {
        type= 'byte[]';
    }
    else if (edmPrimitiveType=='edm.decimal')
    {
        type= 'decimal';
    }
    else if (edmPrimitiveType=='edm.int16')
    { 
        type= 'short'; 
    }
    else if(edmPrimitiveType=='edm.single')
    {    
        type= 'float';
    }
    else if (edmPrimitiveType=='edm.boolean')
    {  
        type= 'bool'; 
    }
    else if (edmPrimitiveType== 'edm.double')
    {
        type= 'double';
    }
    else if (edmPrimitiveType== 'edm.guid')
    {
        type= 'global::System.Guid';
    }
    else if (edmPrimitiveType== 'edm.byte')
    {
        type= 'byte';
    }
    else if (edmPrimitiveType== 'edm.int64')
    {
        type= 'long';
    }
    else if (edmPrimitiveType== 'edm.sByte')
    {
        type= 'sbyte';
    }
    else if (edmPrimitiveType == 'edm.stream')
    {
        type= 'global::Microsoft.OData.Client.DataServiceStreamLink';
    }        
    else if (edmPrimitiveType== 'edm.geography')
    {
        type= 'global::Microsoft.Spatial.Geography';
    }
    else if (edmPrimitiveType== 'edm.geographyPoint')
    {
        type= 'global::Microsoft.Spatial.GeographyPoint';
    }
    else if (edmPrimitiveType== 'edm.geographyLineString')
    {
        type= 'global::Microsoft.Spatial.GeographyLineString';
    }
    else if (edmPrimitiveType== 'edm.geographyPolygon')
    {
        type= 'global::Microsoft.Spatial.GeographyPolygon';
    }
    else if (edmPrimitiveType== 'edm.geographyCollection')
    {
        type= 'global::Microsoft.Spatial.GeographyCollection';
    }
    else if (edmPrimitiveType== 'edm.geographyMultiPolygon')
    {
        type= 'global::Microsoft.Spatial.GeographyMultiPolygon';
    }
    else if (edmPrimitiveType== 'edm.geographyMultiLineString')
    {
        type= 'global::Microsoft.Spatial.GeographyMultiLineString';
    }
    else if (edmPrimitiveType== 'edm.geographyMultiPoint')
    {
        type= 'global::Microsoft.Spatial.GeographyMultiPoint';
    }
    else if (edmPrimitiveType== 'edm.geometry')
    {
        type= 'global::Microsoft.Spatial.Geometry';
    }
    else if (edmPrimitiveType== 'edm.geometryPoint')
    {
        type= 'global::Microsoft.Spatial.GeometryPoint';
    }
    else if (edmPrimitiveType== 'edm.geometryLineString')
    {
        type= 'global::Microsoft.Spatial.GeometryLineString';
    }
    else if (edmPrimitiveType== 'edm.geometryPolygon')
    {
        type= 'global::Microsoft.Spatial.GeometryPolygon';
    }
    else if (edmPrimitiveType== 'edm.geometryCollection')
    {
        type= 'global::Microsoft.Spatial.GeometryCollection';
    }
    else if (edmPrimitiveType== 'edm.geometryMultiPolygon')
    {
        type= 'global::Microsoft.Spatial.GeometryMultiPolygon';
    }
    else if (edmPrimitiveType== 'edm.geometryMultiLineString')
    {
        type= 'global::Microsoft.Spatial.GeometryMultiLineString';
    }
    else if (edmPrimitiveType== 'edm.geometryMultiPoint')
    {
        type= 'global::Microsoft.Spatial.GeometryMultiPoint';
    }
    else if (edmPrimitiveType== 'edm.dateTimeOffset')
    {
        type= 'global::System.DateTimeOffset';
    }
    else if (edmPrimitiveType== 'edm.duration')
    {
        type= 'global::System.TimeSpan';
    }
    else if (edmPrimitiveType== 'edm.date')
    {
        type= 'global::Microsoft.OData.Edm.Library.Date';
    }
    else if (edmPrimitiveType== 'edm.timeOfDay')
    {
        type= 'global::Microsoft.OData.Edm.Library.TimeOfDay';
    }

    return type;
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

var clrReferenceTypes=[
    'string', 'byte[]', 'global::Microsoft.Spatial.Geography', 'global::Microsoft.OData.Client.DataServiceStreamLink',
    'global::Microsoft.Spatial.GeographyPoint', 'global::Microsoft.Spatial.GeographyLineString', 'global::Microsoft.Spatial.GeographyPolygon',
    'global::Microsoft.Spatial.GeographyCollection', 'global::Microsoft.Spatial.GeographyMultiPolygon', 'global::Microsoft.Spatial.GeographyMultiLineString',
    'global::Microsoft.Spatial.GeographyMultiPoint', 'global::Microsoft.Spatial.Geometry', 'global::Microsoft.Spatial.GeometryPoint',
    'global::Microsoft.Spatial.GeometryLineString', 'global::Microsoft.Spatial.GeometryPolygon', 'global::Microsoft.Spatial.GeometryCollection',
    'global::Microsoft.Spatial.GeometryMultiPolygon', 'global::Microsoft.Spatial.GeometryMultiLineString', 'global::Microsoft.Spatial.GeometryMultiPoint'
];