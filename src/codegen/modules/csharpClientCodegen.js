var util = require('util');
var typeMaps = require('./csharpTypeMaps');
var StringHelper = require('../helpers/stringHelper');
var TypesHelper = require('../helpers/typesHelper');

MetadataNamespace = 'Default.Namespace.IfNoNamespaceField'; //The value for test case, if the JSON model does not have api part or name and namespace fields both missing in api part.

var container = require('./entityContainerGenerator');
var castTo = require('./castToMethod');

function hasKeyProperty(type, types){
	for(var i in type.properties){
		if(type.properties[i].isKey){
			return true;
		}
	}

	while(type.baseType){
		type = getType(type.baseType, types);

		return hasKeyProperty(type, types);
	}

	return false;
}

function getType(typeName, types){
	for(var i in types){
		if(types[i].name == typeName){
			return types[i];
		}
	}

	return null;
}

exports.genTypeCtor = genTypeCtor;
function genTypeCtor(typeName, types, namespaceName, superTypeName){
	var type = getType(typeName, types);
	var superType = null;
	if(superTypeName){
		superType = getType(superTypeName, types);
	}
	if(!superType){
		superType = type;
	}
	var ctorParams = '';
	var ctorBodies = '';
	for(var i in type.properties){
		var propType = typeMaps.MapType(type.properties[i].type);
		var propTypeName = propType.type;
		var propTypeFullName = '';
		if(!propType.isPrimitive){
			propTypeFullName = util.format('global::%s.%s', namespaceName, propTypeName);
		}

		var fieldName = StringHelper.capitalizeInitial(type.properties[i].name);
		if(!type.properties[i].isNullable || type.properties[i].isNullable === false){
			if(propType.isPrimitive){
				ctorParams += util.format('%s %s', propTypeName, type.properties[i].name);
			}
			else{
				ctorParams += util.format('%s %s', propTypeFullName, type.properties[i].name);
			}
			
			if(i < type.properties.length - 1){
				ctorParams += ', ';
			}

			if(!propType.isPrimitive){
				ctorBodies += util.format('\
            if(%s == null)\n\
            {\n\
                throw new global::System.ArgumentNullException("%s");\n\
            }\n', type.properties[i].name, type.properties[i].name);
			}
			ctorBodies += util.format('\
            %s.%s = %s;\n', superType.name, fieldName, type.properties[i].name);
		}
	}

	while(type && type.baseType){
		var obj = genTypeCtor(type.baseType, types, namespaceName, superTypeName);
		if(ctorParams !== ''){
			ctorParams = obj.ctorParams + ', ' + ctorParams;
		}
		else{
			ctorParams += obj.ctorParams;
		}
		
		ctorBodies = obj.ctorBodies + ctorBodies;
		type = getType(type.baseType);
	}

	return { ctorParams: ctorParams, ctorBodies: ctorBodies };
}

exports.genEnumType = genEnumType;
function genEnumType(enumType){
	var result = '';
	if(enumType.name){
		var typeName = StringHelper.capitalizeInitial(enumType.name);
		result += util.format('\
    [global::Microsoft.OData.Client.OriginalNameAttribute("%s")]', typeName) + '\n';
		result += util.format('\
    public enum %s', typeName);
		if(enumType.underlyingType){
			result += util.format(': %s\n\
    {\n', typeMaps.MapType(enumType.underlyingType).type);
		}
		else{
			result += '\n\
    {\n';
		}

		if(enumType.members){
			for(var i in enumType.members){
				if(enumType.members[i].name){
					var memberName = StringHelper.capitalizeInitial(enumType.members[i].name);
					result += util.format('\
        [global::Microsoft.OData.Client.OriginalNameAttribute("%s")]\n', memberName);
					result += '\
        ' + memberName;
					if(enumType.members[i].value !== undefined){
						result += util.format(' = %s,', enumType.members[i].value);
					}
					else{
						result += ',';
					}

					if(i == enumType.members.length - 1){
						result = result.substring(0, result.length - 1) + '\n';
					}
					else{
						result += '\n';
					}
				}
			}
		}
		result += '\
    }\n\n';
	}

	return result;
}

exports.genComplexType = genComplexType;
function genComplexType(complexType, types, namespaceName) {
    var result = '';
    if (complexType.name) {
        var typeName = StringHelper.capitalizeInitial(complexType.name);
        result += util.format('\
    [global::Microsoft.OData.Client.OriginalNameAttribute("%s")]\n', typeName);
        result += util.format('\
    public partial class %s', typeName);
        if (complexType.baseType) {
            var baseTypeName = StringHelper.capitalizeInitial(complexType.baseType);
            result += util.format(': %s\n\
    {\n', baseTypeName);
        }
        else {
            result += ': global::System.ComponentModel.INotifyPropertyChanged\n\
    {\n';
        }

        var ctor = util.format('\
public static %s Create%s', typeName, typeName);
        var ctorParams = '';
        var ctorBodies = util.format('\
%s %s = new %s();\n', typeName, complexType.name, typeName);
        var obj = genTypeCtor(complexType.name, types, namespaceName, complexType.name);
        ctorParams += obj.ctorParams;
        ctorBodies += obj.ctorBodies;
        var fields = '';
        var propTypeFullName = '';
        for (var i in complexType.properties) {
            var propType = typeMaps.MapType(complexType.properties[i].type);
            var propTypeName = propType.type;
            if (!propType.isPrimitive) {
                propTypeFullName = util.format('global::%s.%s', namespaceName, propTypeName);
            }

            var fieldName = StringHelper.capitalizeInitial(complexType.properties[i].name);
            fields += util.format('\
        [global::Microsoft.OData.Client.OriginalNameAttribute("%s")]\n', fieldName);
            if (propType.isPrimitive) {
                fields += util.format('\
        public %s %s\n\
        {\n', propTypeName, fieldName);
            }
            else {
                fields += util.format('\
        public %s %s\n\
        {\n', propTypeFullName, fieldName);
            }

            fields += util.format('\
            get\n\
            {\n\
                return this._%s;\n\
            }\n', fieldName);
            fields += util.format('\
            set\n\
            {\n\
                this.On%sChanging(value);\n\
                this._%s = value;\n\
                this.On%sChanged();\n\
                this.OnPropertyChanged("%s");\n\
            }\n', fieldName, fieldName, fieldName, fieldName);
            fields += util.format('\
        }\n\n');
            if (propType.isPrimitive) {
                fields += util.format('\
        private %s _%s;\n\n', propTypeName, fieldName);
                fields += util.format('\
        partial void On%sChanging(%s value);\n\n', fieldName, propTypeName);
            }
            else {
                fields += util.format('\
        private %s _%s;\n\n', propTypeFullName, fieldName);
                fields += util.format('\
        partial void On%sChanging(%s value);\n\n', fieldName, propTypeFullName);
            }

            fields += util.format('\
        partial void On%sChanged();\n\n', fieldName);
        }

        if (!complexType.baseType) {
            fields += '\
        public event global::System.ComponentModel.PropertyChangedEventHandler PropertyChanged;\n\n';
            fields += '\
        protected virtual void OnPropertyChanged(string property)\n\
        {\n\
            if (this.PropertyChanged != null)\n\
            {\n\
                this.PropertyChanged(this, new global::System.ComponentModel.PropertyChangedEventArgs(property));\n\
            }\n\
        }\n\n';
        }

        ctorBodies += util.format('\n\
            return %s;\n', complexType.name);
        result += util.format('\
        %s(%s)\n\
        {\n\
            %s\
        }\n\n', ctor, ctorParams, ctorBodies);
        result += fields;
        result += '\
    }\n\n';

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

function getCLRType(type, namespaceName){
	var typeInfo = typeMaps.MapType(type.type);
	var clrType = typeInfo.type;

	if(typeInfo.isPrimitive === false){
		clrType = util.format('global::%s.%s', namespaceName, typeInfo.type);
	}
	
	if(typeInfo.isPrimitive && typeInfo.isRefType === false && type.isNullable && type.isNullable === true){
		clrType = util.format('global::System.Nullable<%s>', typeInfo.type);
	}

	return clrType;
}

function getExBoundOpOperationCLRType(type, namespaceName){
	var typeInfo = typeMaps.MapType(type.type);
	var clrType = getCLRType(type, namespaceName);
	if(typeInfo.isPrimitive === true){
		// Process primitive-type.
		clrType = type.isCollection && type.isCollection === true ?
			util.format('global::Microsoft.OData.Client.DataServiceQuery<%s>', clrType) :
			util.format('global::Microsoft.OData.Client.DataServiceQuerySingle<%s>', clrType);
	}
	else{ // isPrimitive === false
		// Process entity-type.
		clrType = type.isCollection && type.isCollection === true ?
			util.format('global::Microsoft.OData.Client.DataServiceQuery<%s>', clrType) :
			util.format('%sSingle', clrType);
	}

	return clrType;
}

function getExBoundOpParameterCLRType(type, namespaceName){
	var typeInfo = typeMaps.MapType(type.type);
	var clrType = getCLRType(type, namespaceName);
	if(typeInfo.isPrimitive === true){
		// Process primitive-type.
		clrType = type.isCollection && type.isCollection === true ?
			util.format('global::System.Collections.Generic.ICollection<%s>', clrType) :
			clrType;
	}
	else{ // isPrimitive === false
		// Process entity-type.
		clrType = type.isCollection && type.isCollection === true ?
			util.format('global::System.Collections.Generic.ICollection<%s>', clrType) :
			util.format('%s', clrType);
	}

	return clrType;
}

function getExBoundOpParams(boundParam, params, namespaceName, opType){
	var type = { type: boundParam };
	var paramsStr = util.format('this global::Microsoft.OData.Client.DataServiceQuerySingle<%s> source', getCLRType(type, namespaceName));
	var containsEntityType = false;
	var isCollection = false;
	if(params && params.length > 0){
		for(var i = 0; i < params.length; i++){
			var clrType = typeMaps.MapType(params[i].type);
			if(clrType.isPrimitive === false && containsEntityType === false){
				containsEntityType = true;
				isCollection = params[i].isCollection && params[i].isCollection;
			}
			paramsStr += util.format(', %s %s',
				getExBoundOpParameterCLRType(params[i], namespaceName),
				params[i].name);
		}
	}
	// Maybe there has a bug in T4 template.
	return containsEntityType && opType && opType === 'Function' ? 
		paramsStr + (isCollection ? ', bool useEntityReference = true' : ', bool useEntityReference = false') : 
		paramsStr;
}

function getExBoundFuncReturns(returns, namespaceName, operationName, paramsStr){
	var returnsStr = '';
	var typeInfo = typeMaps.MapType(returns.type);
	var clrType = getCLRType(returns, namespaceName);
	if(typeInfo.isPrimitive === true){
		// Process primitive-type.
		returnsStr = returns.isCollection && returns.isCollection === true ?
			util.format('\
\n\
            return source.CreateFunctionQuery<%s>("%s.%s", true%s);\n', clrType, MetadataNamespace, operationName, paramsStr) :
			util.format('\
\n\
            return source.CreateFunctionQuerySingle<%s>("%s.%s", true%s);\n', clrType, MetadataNamespace, operationName, paramsStr);
	}
	else{ // isPrimitive === false
		// Process entity-type.
		returnsStr = returns.isCollection && returns.isCollection === true ?
			util.format('\
\n\
            return source.CreateFunctionQuery<%s>("%s.%s", true%s);\n', clrType, MetadataNamespace, operationName, paramsStr) :
			util.format('\
\n\
            return new %sSingle(source.CreateFunctionQuerySingle<%s>("%s.%s", true%s));\n', clrType, clrType, MetadataNamespace, operationName, paramsStr);
	}

	return returnsStr;
}

exports.genExBoundOperation = genExBoundOperation;
function genExBoundOperation(operation, boundParam, namespaceName){
	var result = '';
	var operationFrame = '';
	if(operation && operation.operationType === 'Bound'){
		var operationName = StringHelper.capitalizeInitial(operation.name);
		var operationParams = getExBoundOpParams(boundParam, operation.params, namespaceName, operation.type);
		var operationType = '';
		var operationBody = '\
            if (!source.IsComposable)\n\
            {\n\
                throw new global::System.NotSupportedException("The previous function is not composable.");\n\
            }\n';
		if(operation.type === 'Function'){
			if(operation.returns){
				var paramsStr = '';
				if(operation.params && operation.params.length > 0){
					for(var i = 0; i < operation.params.length; i++){
						var clrType = typeMaps.MapType(operation.params[i].type);
						if(clrType.isPrimitive){
							paramsStr += util.format(', new global::Microsoft.OData.Client.UriOperationParameter("%s", %s)', operation.params[i].name, operation.params[i].name);
						}
						else{
							paramsStr += util.format(', new global::Microsoft.OData.Client.UriEntityOperationParameter("%s", %s, useEntityReference)', operation.params[i].name, operation.params[i].name);
						}
					}
				}
				operationType = getExBoundOpOperationCLRType(operation.returns, namespaceName);
				operationBody += getExBoundFuncReturns(operation.returns, namespaceName, operationName, paramsStr);
			}
			else{
				console.error('The unbound function %s must have a return value.', operationName);

				return '';
			}
		}
		else{ // operation.type === Action
			operationType = 'global::Microsoft.OData.Client.DataServiceActionQuery';
			operationBody += util.format('\
\n\
            return new global::Microsoft.OData.Client.DataServiceActionQuery(\n\
                source.Context,\n\
                source.AppendRequestUri("%s.%s")', MetadataNamespace, operationName);
			if(operation.params && operation.params.length > 0){
				for(var j = 0; j < operation.params.length; j++){
				    operationBody += util.format('\
,\n\
                new global::Microsoft.OData.Client.BodyOperationParameter("%s", %s)', operation.params[j].name, operation.params[j].name);
			    }
			}
			
			operationBody += ');\n';
		}

		operationFrame = util.format('\
        /// <summary>\n\
        /// There are no comments for %s in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("%s")]\n\
        public static %s %s(%s)\n\
        {\n\
%s\
        }\n', operationName, operationName, operationType, operationName, operationParams, operationBody);
	}

	return operationFrame;
}

exports.genExBoundOperations = genExBoundOperations;
function genExBoundOperations(entityType, namespaceName){
	var boundParam = entityType.name;
	var props = entityType.properties;
	var result = '';
	for(var i = 0; i < props.length; i++){
		if(props[i].type === 'Function' || props[i].type === 'Action'){
			result += genExBoundOperation(props[i], boundParam, namespaceName) + '\n';
		}
	}

	return result;
}

exports.genExtensionMethods = genExtensionMethods;
function genExtensionMethods(methods){
	var result = '\
    /// <summary>\n\
    /// Class containing all extension methods\n\
    /// </summary>\n\
    public static class ExtensionMethods\n\
    {\n';
	result += methods;
	result += '\
    }\n';

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
        if (api.namespace){
            result += util.format(' * Namespace: %s\n', api.namespace);
            MetadataNamespace = api.namespace;
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

    var exBoundOps = '';
    result += util.format('\
namespace %s\n{\n', namespaceName);
    result += container.generate(jObj, namespaceName);
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
                else
                {
                    result += genComplexType(type, jObj.types, namespaceName);
                }
            }
            // Generate extension methods.
			// Generate extension bound operations.
			exBoundOps += genByKey(jObj.types, namespaceName);
            
            exBoundOps += castTo.generateCastTo(jObj, namespaceName);

			if(!type.members && hasKeyProperty(type, jObj.types)){
				// Generate extension methods.
				// Generate extension bound operations.
				exBoundOps += genExBoundOperations(type, namespaceName);
			}
        }
    }
	// Put on the extension methods class frame.
	result += genExtensionMethods(exBoundOps);

    result += '\
}\n';

    return result;
}

exports.CodegenByObj = function (jObj) {
    return codegen(jObj, jObj.api.namespace);
};

exports.Codegen = function (jsonMetadata) {
    var jObj = JSON.parse(jsonMetadata);

    return codegen(jObj, jObj.api.namespace);
};