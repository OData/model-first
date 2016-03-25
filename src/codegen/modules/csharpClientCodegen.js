var util = require('util');
var typeMaps = require('./csharpTypeMaps');
var StringHelper = require('../helpers/stringhelper');
var TypesHelper = require('../helpers/typeshelper');

MetadataNamespace = 'Microsoft.OData.SampleService.Models.TripPin';

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

exports.genEntityType = genEntityType;
function genEntityType(entityType, types, namespaceName){
	var result = '';
		
	var entityTypeName = StringHelper.excapeKeyword(entityType.name);
	
	var entityTypeNames = [];
	entityTypeNames = TypesHelper.GetEntityTypeNames(types);
	
	var keyProperties = [];
	TypesHelper.GetKeyProperties(entityType, types, keyProperties);
	
	var nonNullableProperties = [];
	TypesHelper.GetNonNullableProperties(entityType, types, nonNullableProperties);
	
	var keyNames = [];
	
	if (keyProperties.length > 0)
	{
		var keyNamesAttribute = 'new string[] {';
		for (var i = 0; i < keyProperties.length; i++) {
			var keyName = StringHelper.capitalizeInitial(keyProperties[i].name);
			keyNames.push(keyName);
			if(keyProperties.length == 1)
			{
				result += util.format('    [global::Microsoft.OData.Client.Key("%s")]', keyName) + '\n';
			}
			else //keyProperties.length > 1
			{
				if (i < keyProperties.length-1 )
				{
					keyNamesAttribute += '"' + keyName + '", ';
				}
				else
				{
					keyNamesAttribute += '"' + keyName + '" }';
				}
			}
		}
		
		if( keyNamesAttribute.length > 14 )
		{
			result += util.format('    [global::Microsoft.OData.Client.Key(%s)]', keyNamesAttribute) + '\n';
		}
	}
	
	var typeNameCap = StringHelper.capitalizeInitial(entityType.name);
	result += util.format('    [global::Microsoft.OData.Client.OriginalNameAttribute("%s")]', typeNameCap) + '\n';
	
	var baseTypeString = 'global::Microsoft.OData.Client.BaseEntityType, global::System.ComponentModel.INotifyPropertyChanged';
	
	if(entityType.baseType)
	{
		baseTypeString = StringHelper.capitalizeInitial(entityType.baseType);
	}
	
	result += util.format('    public partial class %s : %s', typeNameCap, baseTypeString);
	result += '\n    {\n';
	
	result += util.format('        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n');
	
	var paramList = '';
	
	for(var j = 0; j < keyProperties.length; j++ )
	{
		paramList += TypesHelper.GetTypeDefString(keyProperties[j], namespaceName, types) + ' ' +  StringHelper.excapeKeyword(keyProperties[j].name);
		
		if( j < nonNullableProperties.length -1 )
		{
			paramList += ', ';
		}
		else if(j == (keyProperties.length - 1) && nonNullableProperties.length > 0)
		{
			paramList += ', ';
		}
	}
	
	for(var k = 0; k < nonNullableProperties.length; k++ )
	{
		var typeDefString = TypesHelper.GetTypeDefString(nonNullableProperties[k], namespaceName, types);
		
		if( k < nonNullableProperties.length -1 )
		{
			paramList += typeDefString + ' ' +  StringHelper.excapeKeyword(nonNullableProperties[k].name) + ', ';
		}
		else
		{
			paramList += typeDefString + ' ' +  StringHelper.excapeKeyword(nonNullableProperties[k].name);
		}
	}
	
	result += util.format('        public static %s Create%s(%s)', typeNameCap, typeNameCap, paramList);
	result += '\n        {\n';
	result += util.format('            %s %s = new %s();\n', typeNameCap, entityTypeName, typeNameCap);
	
	for(var l = 0; l < keyProperties.length; l++ )
	{
		var keyParamTypeDef = TypesHelper.GetTypeDefString(keyProperties[l], namespaceName, types);
		var keyPropName = StringHelper.excapeKeyword(keyProperties[l].name);
		if(keyParamTypeDef.substring(0, 8) == 'global::')
		{
			result +=util.format('\
            if ((%s == null))\n\
            {\n\
                throw new global::System.ArgumentNullException("%s");\n\
            }\n', keyPropName, keyPropName);
		}
		result += '            ' + entityTypeName + '.' + StringHelper.capitalizeInitial(keyProperties[l].name) + ' = ' + keyPropName + ';\n';
	}
	
	for(var m = 0; m < nonNullableProperties.length; m++ )
	{
		var nonNullableParamTypeDef = TypesHelper.GetTypeDefString(nonNullableProperties[m], namespaceName, types);
		var nonNullablePropName = StringHelper.excapeKeyword(nonNullableProperties[m].name);
		if(nonNullableParamTypeDef.substring(0, 8) == 'global::')
		{
			result +=util.format('\
            if ((%s == null))\n\
            {\n\
                throw new global::System.ArgumentNullException("%s");\n\
            }\n', nonNullablePropName, nonNullablePropName);
		}
		result += '            ' + entityTypeName + '.' + StringHelper.capitalizeInitial(nonNullableProperties[m].name) + ' = ' + nonNullablePropName + ';\n';

	}
	
	result += '            return ' + entityTypeName + ';\n';
	
	result += '        }\n';
	
	var properties = entityType.properties;
	
	for(var a = 0; a < properties.length; a++)
	{
		if((properties[a].type != 'Function' && properties[a].type != 'Action'))
		{
			var typeDef = TypesHelper.GetTypeDefString(properties[a], namespaceName, types);
			
			var propName = StringHelper.capitalizeInitial(properties[a].name);
			
			result += '        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n';
			result += util.format('        [global::Microsoft.OData.Client.OriginalNameAttribute("%s")]\n', propName);
			result += '        public ' + typeDef + ' ' + propName + '\n';
			result += '        {\n';
			result += '            get\n';
			result += '            {\n';
			result += util.format('                return this._%s;\n', propName);
			result += '            }\n';
			result += '            set\n';
			result += '            {\n';
			result += util.format('                this.On%sChanging(value);\n', propName);
			result += util.format('                this._%s = value;\n', propName);
			result += util.format('                this.On%sChanged();\n', propName);
			result += util.format('                this.OnPropertyChanged("%s");\n', propName);
			result += '            }\n';
			result += '        }\n';
			result += '        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n';
			if(properties[a].isCollection && properties[a].isCollection === true)
			{
				result += util.format('        private %s _%s = new %s', typeDef, propName, typeDef);
				if(TypesHelper.IsEntityType(properties[a].type, entityTypeNames))
				{
					result += '(null, global::Microsoft.OData.Client.TrackingMode.None);\n';
				}
				else
				{
					result += '();\n';
				}
			}
			else
			{
				result += util.format('        private %s _%s;\n', typeDef, propName);
			}
			result += util.format('        partial void On%sChanging(%s value);\n', propName, typeDef);
			result += util.format('        partial void On%sChanged();\n', propName);
			
			if(a === 0 && !entityType.baseType)
			{
				result += '        /// <summary>\n';
				result += '        /// This event is raised when the value of the property is changed\n';
				result += '        /// </summary>\n';
				result += '        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n';
				result += '        public event global::System.ComponentModel.PropertyChangedEventHandler PropertyChanged;\n';
				result += '        /// <summary>\n';
				result += '        /// The value of the property is changed\n';
				result += '        /// </summary>\n';
				result += '        /// <param name="property">property name</param>\n';
				result += '        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n';
				result += '        protected virtual void OnPropertyChanged(string property)\n';
				result += '        {\n';
				result += '            if ((this.PropertyChanged != null))\n';
				result += '            {\n';
				result += '                this.PropertyChanged(this, new global::System.ComponentModel.PropertyChangedEventArgs(property));\n';
				result += '            }\n';
				result += '        }\n';
			}
		}
		else if (properties[a].type == 'Function' && properties[a].operationType == 'Bound')
		{
			functionName = StringHelper.capitalizeInitial(properties[a].name);
			
			result += '        [global::Microsoft.OData.Client.OriginalNameAttribute("'+ functionName +'")]\n';
			
			var functionFullName = namespaceName + '.'+ functionName;
			var functionMetadataFullName = MetadataNamespace + '.'+ functionName;
			
            var paramListOnFunction = '';
			var paramString = '';
			var params = properties[a].params;
			
			if(params)
			{
				for(var o = 0; o < params.length; o++)
				{
					var paraTypeDef = TypesHelper.GetParameterTypeString(params[o], namespaceName, types);
					
                    var hasUseEntityReferenceParam = false;
                    
                    if( o > 0)
                    {
                        paramString += ',\n\
                    ';
                    }
                    else
                    {
                        paramString += ', ';
                    }
                    
                    if(TypesHelper.IsEntityType(params[o].type, entityTypeNames))
                    {
                        if(!hasUseEntityReferenceParam)
                        {
                            hasUseEntityReferenceParam = true;
                        }
                        
                        paramString += util.format('new global::Microsoft.OData.Client.UriEntityOperationParameter("%s", %s, useEntityReference)', StringHelper.excapeKeyword(params[o].name), StringHelper.excapeKeyword(params[o].name));
                    }
                    else
                    {
                        paramString += util.format('new global::Microsoft.OData.Client.UriOperationParameter("%s", %s)', StringHelper.excapeKeyword(params[o].name), StringHelper.excapeKeyword(params[o].name));
                    }
                    
					if( o < params.length -1 )
					{
						paramListOnFunction += util.format('%s %s, ', paraTypeDef, StringHelper.excapeKeyword(params[o].name));
					}
					else
					{
						paramListOnFunction += util.format('%s %s', paraTypeDef, StringHelper.excapeKeyword(params[o].name));
                        
                        if(hasUseEntityReferenceParam)
                        {
                            paramListOnFunction +=', bool useEntityReference = false';
                            hasUseEntityReferenceParam = false;
                        }    
					}
				}
			}
            
			var returnType = '';
			var newReturnContent = '';
			var isReturnTypeEntityType = TypesHelper.IsEntityType(properties[a].returns.type, entityTypeNames);
            var returnTypeName = TypesHelper.GetReturnTypeStringWithoutCollection(properties[a].returns, namespaceName, types);
            
            if(!properties[a].returns.isCollection)
			{
                if(isReturnTypeEntityType)
                {
                    returnType = returnTypeName + 'Single';
                    newReturnContent = 'new ' + returnTypeName + 'Single' + '(this.Context.CreateFunctionQuerySingle<' + returnTypeName + '>(string.Join("/", global::System.Linq.Enumerable.Select(global::System.Linq.Enumerable.Skip(requestUri.Segments, this.Context.BaseUri.Segments.Length), s => s.Trim(\'/\'))), "' + functionMetadataFullName + '", true' + paramString + '));';
                }
                else
                {
                    returnType = 'global::Microsoft.OData.Client.DataServiceQuerySingle<' + returnTypeName + '>';
                    newReturnContent = 'this.Context.CreateFunctionQuerySingle<' + returnTypeName + '>(string.Join("/",\ global::System.Linq.Enumerable.Select(global::System.Linq.Enumerable.Skip(requestUri.Segments, this.Context.BaseUri.Segments.Length), s => s.Trim(\'/\'))), "' + functionMetadataFullName + '", true' + paramString + ');';
                }
			}
			else
			{
				returnType = 'global::Microsoft.OData.Client.DataServiceQuery<' + returnTypeName + '>';
				newReturnContent = 'this.Context.CreateFunctionQuery<' + returnTypeName + '>(string.Join("/",\ global::System.Linq.Enumerable.Select(global::System.Linq.Enumerable.Skip(requestUri.Segments, this.Context.BaseUri.Segments.Length), s => s.Trim(\'/\'))), "' + functionMetadataFullName + '", true' + paramString + ');';
			}
					
			result += '        public ' + returnType + ' ' + functionName + '(' + paramListOnFunction + ')\n\
        {\n\
            global::System.Uri requestUri;\n\
            Context.TryGetUri(this, out requestUri);\n\n\
            return '+ newReturnContent + '\n\
        }\n';
		}
		else if (properties[a].type == 'Action')
		{
			var actionName = StringHelper.capitalizeInitial(properties[a].name);
			var actionFullName = namespaceName + '.'+ actionName;
			var actionMetadataFullName = MetadataNamespace + '.'+ actionName;
			
			var returnTypeAction = '';
			var newReturnType = '';
			
			returnTypeAction = 'global::Microsoft.OData.Client.DataServiceActionQuery';
			newReturnType = 'new global::Microsoft.OData.Client.DataServiceActionQuery';
			//Actions having return types are not implemented by Microsoft ODATA service, so here only cover no return type situation.
			
			var paramListOnAction = '';
			var paramStringAction = '';
			var paramsAction = properties[a].params;
			
			if(paramsAction)
			{
				for(var p = 0; p < paramsAction.length; p++)
				{
					var paramTypeDef = TypesHelper.GetParameterTypeString(paramsAction[p], namespaceName, types);

					var paramName = StringHelper.excapeKeyword(paramsAction[p].name);
					
					if( p < paramsAction.length -1 )
					{
						paramListOnAction += util.format('%s %s, ', paramTypeDef, paramName);
					}
					else
					{
						paramListOnAction += util.format('%s %s', paramTypeDef, paramName);
					}
                    
                    if( p > 0)
                    {
                        paramStringAction += ',\n\
                    ';
                    }
                    else
                    {
                        paramStringAction += ', ';
                    }
                    
					paramStringAction += util.format('new global::Microsoft.OData.Client.BodyOperationParameter("%s", %s)', paramName, paramName);
				}
			}
			
			result += '        public ' + returnTypeAction + ' ' + actionName + '(' + paramListOnAction + ')\n\
        {\n\
            global::Microsoft.OData.Client.EntityDescriptor resource = Context.EntityTracker.TryGetEntityDescriptor(this);\n\
            if (resource == null)\n\
            {\n\
                throw new global::System.Exception("cannot find entity");\n\
            }\n\n\
            return '+ newReturnType +'(this.Context, resource.EditLink.OriginalString.Trim(\'/\') + "/' + actionMetadataFullName + '"' + paramStringAction + ');\n\
        }\n';
		}
	}
	
	result += '    }\n'; //The end of entity type 
	
	/*The start of entity type single*/
	var typeNameSingle = typeNameCap + 'Single';
	
	result += util.format('    [global::Microsoft.OData.Client.OriginalNameAttribute("%s")]\n', typeNameSingle);
	result += util.format('    public partial class %s : global::Microsoft.OData.Client.DataServiceQuerySingle<%s>\n', typeNameSingle, typeNameCap);
	result += '    {\n';
	result += util.format('\
        /// <summary>\n\
        /// Initialize a new %s object.\n\
        /// </summary>\n', typeNameSingle);
	result += util.format('\
        public %s(global::Microsoft.OData.Client.DataServiceContext context, string path)\n\
            : base(context, path) {}\n\n', typeNameSingle);
	result += util.format('\
        /// <summary>\n\
        /// Initialize a new %s object.\n\
        /// </summary>\n', typeNameSingle);
	result += util.format('\
        public %s(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)\n\
            : base(context, path, isComposable) {}\n\n', typeNameSingle);
	result += util.format('\
        /// <summary>\n\
        /// Initialize a new %s object.\n\
        /// </summary>\n', typeNameSingle);
	result += util.format('\
        public %s(global::Microsoft.OData.Client.DataServiceQuerySingle<%s> query)\n\
            : base(query) {}\n', typeNameSingle, typeNameCap);
            
	var navProperties = [];
	navProperties = TypesHelper.GetNavProperties(entityType, entityTypeNames);
	
	for(var q = 0; q < navProperties.length; q++)
	{
		var navPropName = StringHelper.capitalizeInitial(navProperties[q].name);
		var navPropType = StringHelper.capitalizeInitial(navProperties[q].type);
		var navPropTypeFullName = namespaceName + '.' + navPropType;
		
		var propertTypeString = '';
		var newPropString = '';
		if(navProperties[q].isCollection)
		{
			propertTypeString = util.format('global::Microsoft.OData.Client.DataServiceQuery<global::%s>', navPropTypeFullName);
			newPropString = util.format('Context.CreateQuery<global::%s>(GetPath("%s"));', navPropTypeFullName, navPropName);
		}
		else
		{
			propertTypeString = util.format('global::%sSingle', navPropTypeFullName);
			newPropString = util.format('new global::%sSingle(this.Context, GetPath("%s"));', navPropTypeFullName, navPropName);
		}
		
		result += util.format('\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("%s")]\n\
        public %s %s\n\
        {\n\
            get\n\
            {\n\
                if (!this.IsComposable)\n\
                {\n\
                    throw new global::System.NotSupportedException("The previous function is not composable.");\n\
                }\n\
                if ((this._%s == null))\n\
                {\n\
                    this._%s = %s\n\
                }\n\
                return this._%s;\n\
            }\n\
        }\n', navPropName, propertTypeString, navPropName, navPropName, navPropName, newPropString, navPropName);
		result += util.format('\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        private %s _%s;\n', propertTypeString, navPropName);
	}
	
	result += '    }\n'; // entity single class end

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
			
			if( type.properties )
			{
				if(TypesHelper.HasKeyProperty(type, jObj.types))
				{
					result += genEntityType(type, jObj.types, namespaceName);
				}
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