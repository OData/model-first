var util = require('util');
var typeMaps = require('./csharpTypeMaps');
var StringHelper = require('../helpers/stringhelper');

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
function genComplexType(complexType, types, namespaceName)
{
	var result = '';
	if(complexType.name){
		var typeName = StringHelper.capitalizeInitial(complexType.name);
		result += util.format('\
    [global::Microsoft.OData.Client.OriginalNameAttribute("%s")]\n', typeName);
		result += util.format('\
    public partial class %s', typeName);
		if(complexType.baseType){
			var baseTypeName = StringHelper.capitalizeInitial(complexType.baseType);
			result += util.format(': %s\n\
    {\n', baseTypeName);
		}
		else{
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
		for(var i in complexType.properties){
			var propType = typeMaps.MapType(complexType.properties[i].type);
			var propTypeName = propType.type;
			if(!propType.isPrimitive){
				propTypeFullName = util.format('global::%s.%s', namespaceName, propTypeName);
			}

			var fieldName = StringHelper.capitalizeInitial(complexType.properties[i].name);
			fields += util.format('\
        [global::Microsoft.OData.Client.OriginalNameAttribute("%s")]\n', fieldName);
			if(propType.isPrimitive){
				fields += util.format('\
        public %s %s\n\
        {\n', propTypeName, fieldName);
			}
			else{
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
			if(propType.isPrimitive){
				fields += util.format('\
        private %s _%s;\n\n', propTypeName, fieldName);
				fields += util.format('\
        partial void On%sChanging(%s value);\n\n', fieldName, propTypeName);
			}
			else{
				fields += util.format('\
        private %s _%s;\n\n', propTypeFullName, fieldName);
				fields += util.format('\
        partial void On%sChanging(%s value);\n\n', fieldName, propTypeFullName);
			}
			
			fields += util.format('\
        partial void On%sChanged();\n\n', fieldName);
		}

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
		
		return result;
	}
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

    result += util.format('\
namespace %s\n{\n', namespaceName);
    if (jObj.types) {
        for (var j in jObj.types) {
            var type = jObj.types[j];
            if (type.members) {
                result += genEnumType(type);
            }
			
			if(!type.members && !hasKeyProperty(type, jObj.types)){
				result += genComplexType(type, jObj.types, namespaceName);
			}
        }
    }

    result += '\
}\n';

    return result;
}

exports.CodegenByObj = function (jObj, namespaceName) {
    return codegen(jObj, namespaceName);
};

exports.Codegen = function (jsonMetadata, namespaceName) {
    var jObj = JSON.parse(jsonMetadata);

    return codegen(jObj, namespaceName);
};