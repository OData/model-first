var util = require('util');
var typeMaps = require('./csharpTypeMaps');
var constants = require('../config').Constants;
var StringHelper = require('../helpers/stringhelper');
var ParseHelper = require('../helpers/parsehelper');

exports.genEntityType = genEntityType;
function genEntityType(entityType, types, namespaceName){
	var fields = '';
	for(var i = 0; i < entityType.properties.length; i++){
		var prop = entityType.properties[i];

		// Skip to  parse all the operations.
		if(prop.type === 'Function' || prop.type === 'Action'){
			continue;
		}

		var propType = typeMaps.MapType(prop.type);
		var propName = StringHelper.capitalizeInitial(prop.name);

		// Check whether the property's type is primitive or complex type or not.
		if(propType.isPrimitive || !ParseHelper.hasKeyProperty(ParseHelper.getType(prop.type, types), types)){
			if(prop.isCollection){
				fields += util.format('\
        public System.Collections.Generic.ICollection<%s> %s { get; set; }\n', propType.type, propName);
			}
			else{
				if(prop.isKey){
					fields += '\
        [System.ComponentModel.DataAnnotations.Key]\n';
				}
				if(propType.isRefType){
					fields += util.format('\
        public %s %s { get; set; }\n', propType.type, propName);
				}
				else{
					if(prop.isNullable){
						fields += util.format('\
        public global::System.Nullable<%s> %s { get; set; }\n', propType.type, propName);
					}
					else{
						fields += util.format('\
        public %s %s { get; set; }\n', propType.type, propName);
					}
				}
			}
		}
		else{
			// Check whether the property's type is entity type or not.
			if(prop.isCollection){
				fields += util.format('\
        public virtual System.Collections.Generic.ICollection<%s> %s { get; set; }\n', namespaceName + '.Models.' + propType.type, propName);
			}
			else{
				fields += util.format('\
        public virtual %s %s { get; set; }\n', namespaceName + '.Models.' + propType.type, propName);
			}
		}
	}

	var result = '\
namespace ' + namespaceName + '.Models\n\
{\n';
	result += '\
    public class ' + StringHelper.capitalizeInitial(entityType.name);
    if(entityType.baseType){
		result += util.format(' : %s.Models.%s\n', namespaceName, StringHelper.capitalizeInitial(entityType.baseType));
	}
	else{
		result += '\n';
	}
	
    result += '\
    {\n';
	result += fields;
	result += '\
    }\n';
	result += '\
}\n';

	var fileName = StringHelper.capitalizeInitial(entityType.name) + '.cs';
	return {
		fileName: fileName,
		compileInfo: util.format('<Compile Include="Models\\%s" />', fileName),
		content: result
	};
}

exports.genComplexType = genComplexType;
function genComplexType(complexType, namespaceName){
	var result = '\
namespace ' + namespaceName + '.Models\n\
{\n';
	result += util.format('\
    [System.ComponentModel.DataAnnotations.Schema.ComplexType]\n\
    public class %s', StringHelper.capitalizeInitial(complexType.name));
	if(complexType.baseType){
		result += util.format(' : %s.Models.%s\n', namespaceName, StringHelper.capitalizeInitial(complexType.baseType));
	}
	else{
		result += '\n';
	}

    result += '\
    {\n';
    for(var i = 0; i < complexType.properties.length; i++){
    	var prop = complexType.properties[i];

    	// Skip to  parse all the operations.
    	if(prop.type === 'Function' || prop.type === 'Action'){
			continue;
		}

		var propType = typeMaps.MapType(prop.type);
		var propName = StringHelper.capitalizeInitial(prop.name);
		
		if(prop.isCollection){
			result += util.format('\
        public System.Collections.Generic.ICollection<%s> %s { get; set; }\n', propType.type, propName);
		}
		else{
			if(propType.isPrimitive){
				if(propType.isRefType){
					result += util.format('\
        public %s %s { get; set; }\n', propType.type, propName);
				}
				else{
					if(prop.isNullable){
						result += util.format('\
        public global::System.Nullable<%s> %s { get; set; }\n', propType.type, propName);
					}
					else{
						result += util.format('\
        public %s %s { get; set; }\n', propType.type, propName);
					}
				}
			}
			else{
				result += util.format('\
        public %s %s { get; set; }\n', namespaceName + '.Models.' + propType.type, propName);
			}
		}
    }

    result += '\
    }\n';
	
	result += '\
}\n';

	var fileName = StringHelper.capitalizeInitial(complexType.name) + '.cs';
	return {
		fileName: fileName,
		compileInfo: util.format('<Compile Include="Models\\%s" />', fileName),
		content: result
	};
}

exports.genEnumType = genEnumType;
function genEnumType(enumType, namespaceName){
	var result = '\
namespace ' + namespaceName + '.Models\n\
{\n';
	if(enumType.flags){
		result += '\
    [System.Flags]\n';
	}

	result += util.format('\
    public enum %s', StringHelper.capitalizeInitial(enumType.name));
    if(enumType.underlyingType){
    	result += util.format(': %s', typeMaps.MapType(enumType.underlyingType).type);
    }

    result += '\n\
    {\n';
    for(var i = 0; i < enumType.members.length; i++){
    	var member = enumType.members[i];
    	if(typeof member === 'string'){
    		result += '\
        ' + StringHelper.capitalizeInitial(member);
        	if(i === enumType.members.length - 1){
    			result += '\n';
    		}
    		else{
    			result += ',\n';
    		}
    	}
    	else if(typeof member === 'object'){
			result += '\
        ' + StringHelper.capitalizeInitial(member.name);
        	if(member.value !== undefined){
        		result += ' = ' + member.value + ',\n';
        	}
        	else{
        		if(i === enumType.members.length - 1){
        			result += '\n';
        		}
        		else{
        			result += ',\n';
        		}
        	}
    	}
    }
    result += '\
    }\n';
	
	result += '\
}\n';

	var fileName = StringHelper.capitalizeInitial(enumType.name) + '.cs';
	return {
		fileName: fileName,
		compileInfo: util.format('<Compile Include="Models\\%s" />', fileName),
		content: result
	};
}

exports.genDbContext = genDbContext;
function genDbContext(entitySets, namespaceName){
	var result = '\
namespace ' + namespaceName + '\n';
	result += '\
{\n';
	result += '\
    /// <summary>\n\
    /// The DemoContext class.\n\
    /// </summary>\n';
    result += '\
    public class DemoContext : System.Data.Entity.DbContext\n';
    result += '\
    {\n';
    result += '\
        /// <summary>\n\
        /// The constructor of the class DemoContext.\n\
        /// </summary>\n';
    result += '\
        public DemoContext()\n\
            : base("DemoDb")\n\
        {\n\
        }\n';
	for(var i = 0; i < entitySets.length; i++){
		result += util.format('\
        /// <summary>\n\
        /// Gets or sets the %s entity-set.\n\
        /// </summary>\n', StringHelper.capitalizeInitial(entitySets[i].name));
		result += util.format('\
        public System.Data.Entity.DbSet<%s> %s { get; set; }\n', constants.Code.ServerDefaultNamespace + '.Models.' + StringHelper.capitalizeInitial(entitySets[i].type), StringHelper.capitalizeInitial(entitySets[i].name));
	}

	result += '\
    }\n';
	result += '\
}\n';

	return {
		fileName: 'DemoContext.cs',
		compileInfo: '<Compile Include="Models\\DemoContext.cs" />',
		content: result
	};
}

exports.codegen = codegen;
function codegen(jObj, namespaceName){
	var files = [];
	if(jObj && jObj.types){
		for(var i = 0; i < jObj.types.length; i++){
			var type = jObj.types[i];
			if(ParseHelper.hasKeyProperty(type, jObj.types)){
				// The type is entity type.
				files.push(genEntityType(type, jObj.types, namespaceName));
			}
			else{
				if(type.members){
					// The type is enumeration type.
					files.push(genEnumType(type, namespaceName));
				}
				else{
					// The type is complex type.
					files.push(genComplexType(type, namespaceName));
				}
			}
		}
	}

	if(jObj && jObj.container && jObj.container.entitysets){
		files.push(genDbContext(jObj.container.entitysets, namespaceName));
	}

	return files;
}

exports.CodegenByObj = function(jObj, namespaceName){
	return codegen(jObj, namespaceName);
};

exports.Codegen = function(jsonMetadata, namespaceName){
	var jObj = JSON.parse(jsonMetadata);

	return codegen(jObj, namespaceName);
};
