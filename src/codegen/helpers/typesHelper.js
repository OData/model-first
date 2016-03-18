var typeMaps = require('../modules/csharpTypeMaps');
var StringHelper = require('../helpers/stringhelper');

function getType(typeName, types){
    for(var i in types){
        if(types[i].name == typeName){
            return types[i];
        }
    }

    return null;
}

function isComplexOrEntityType(types, typeName)
{
 for (i=0; i< types.length; i++)
 {
     if(types[i].name == typeName && types[i].members === undefined)
     {
         return true;
     }
 }

 return false;
}

function isEntityType(typeName, entityTypeNames)
{
	for(var i = 0; i < entityTypeNames.length ; i++)
	{
		if(typeName == entityTypeNames[i])
		{
			return true;
		}
	}
	
	return false;
}

exports.IsReferenceType = IsReferenceType;
function IsReferenceType(type, types) {
    if( isComplexOrEntityType( types, type ) )
    {
        return true;
    }
    
    var referenceTypeNames = [
     'string', 'byte[]', 'global::Microsoft.Spatial.Geography', 'global::Microsoft.OData.Client.DataServiceStreamLink',
     'global::Microsoft.Spatial.GeographyPoint', 'global::Microsoft.Spatial.GeographyLineString', 'global::Microsoft.Spatial.GeographyPolygon',
     'global::Microsoft.Spatial.GeographyCollection', 'global::Microsoft.Spatial.GeographyMultiPolygon', 'global::Microsoft.Spatial.GeographyMultiLineString',
     'global::Microsoft.Spatial.GeographyMultiPoint', 'global::Microsoft.Spatial.Geometry', 'global::Microsoft.Spatial.GeometryPoint',
     'global::Microsoft.Spatial.GeometryLineString', 'global::Microsoft.Spatial.GeometryPolygon', 'global::Microsoft.Spatial.GeometryCollection',
     'global::Microsoft.Spatial.GeometryMultiPolygon', 'global::Microsoft.Spatial.GeometryMultiLineString', 'global::Microsoft.Spatial.GeometryMultiPoint'];
     
    for(var i = 0; i < referenceTypeNames.length; i++ )
    {
        if( type == referenceTypeNames[i] )
        {
            return true;
        }
    }
    
    return false;
}

exports.GetTypeDefString = function(property, namespaceName, types)
{
	var isEntityTypeResult = isEntityType(property.type, GetEntityTypeNames(types));
    typeMap = typeMaps.MapType(property.type);
	var typeDef = typeMap.type;
	if(!typeMap.isPrimitive) //Non Primitive Type
	{
		typeDef = 'global::' + namespaceName + '.' + typeDef;
		
		if(isEntityTypeRestult && property.isCollection)
		{
			typeDef = 'global::Microsoft.OData.Client.DataServiceCollection<' + typeDef + '>';
		}
	}
		
	if(!isEntityTypeResult && property.isCollection) // Any Type except entity type that is a collection
	{
		typeDef = 'global::System.Collections.ObjectModel.ObservableCollection<' + typeDef + '>';
	}
	
	if(!property.isCollection && !IsReferenceType(property.type, types) && property.isNullable)
	{
		typeDef = 'global::System.Nullable<' + typeDef + '>';
	}
	
	return typeDef;
};

exports.GetEntityTypeNames = GetEntityTypeNames;
function GetEntityTypeNames(types)
{
	var entityTypeNames = [];
	for(var i = 0; i < types.length; i ++)
	{
		if(HasKeyProperty(types[i], types))
		{
			entityTypeNames.push(types[i].name);
		}
	}
	
	return entityTypeNames;
}

exports.HasKeyProperty = HasKeyProperty;
function HasKeyProperty(type, types){
    for(var i in type.properties){
        if(type.properties[i].isKey){
            return true;
        }
    }

    if(type.baseType){
        type = getType(type.baseType, types);

        return HasKeyProperty(type, types);
    }

    return false;
}

// The parameter keyProperties is an array of key properties
exports.GetKeyProperties = GetKeyProperties;
function GetKeyProperties(type, types, keyProperties){
    for(var i in type.properties){
        if(type.properties[i].isKey){
			keyProperties.push(type.properties[i]);            
        }
    }
	
	if ( keyProperties.length > 0 )
	{
		return true;
	}

    if(type.baseType){
        type = getType(type.baseType, types);

        return GetKeyProperties(type, types, keyProperties);
    }

    return false;
}

//Find the non-nullable properties except key properties 
exports.GetNonNullableProperties = GetNonNullableProperties;
function GetNonNullableProperties(type, types, nonNullableProperties)
{
	for(var i in type.properties){
		if((!type.properties[i].isNullable) && (!type.properties[i].isKey) && (type.properties[i].type != 'Action') && (type.properties[i].type != 'Function')){
			nonNullableProperties.push(type.properties[i]);			
		}
	}
	
	if(type.baseType){
        type = getType(type.baseType, types);

        return GetNonNullableProperties(type, types, nonNullableProperties);
    }
	
	return nonNullableProperties.length > 0;
}

//Find the navigation properties that has type of other entity type
exports.GetNavProperties = function(type, entityTypeNames)
{
	var naviProperties = [];
	
	for(var i = 0; i < type.properties.length; i++){
		var typeMap = typeMaps.MapType(type.properties[i].type);
		if(typeDef != 'Function' && typeDef != 'Action' && !typeMap.isPrimitive)
		{
			if(isEntityType(type.properties[i].type, entityTypeNames))
			{
				naviProperties.push(type.properties[i]);
			}
		}
	}
		
	return naviProperties;
};