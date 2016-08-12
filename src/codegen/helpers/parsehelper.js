//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

exports.hasKeyProperty = hasKeyProperty;
function hasKeyProperty(type, types){
	if(type && type.properties){
		for(var i in type.properties){
			if(type.properties[i].isKey){
				return true;
			}
		}

		while(type.baseType){
			type = getType(type.baseType, types);

			return hasKeyProperty(type, types);
		}
	}
	
	return false;
}

exports.getType = getType;
function getType(typeName, types){
	for(var i in types){
		if(types[i].name == typeName){
			return types[i];
		}
	}

	return null;
}
