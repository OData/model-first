//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

exports.capitalizeInitial = function (target) {
    var initial = target.charAt(0).toUpperCase();

    return initial + target.substring(1, target.length);
};

exports.addSlash = function (target) {
    if (target.charAt(target.length - 1) != '/') {
        return target + '/';
    }

    return target;
};

exports.excapeKeyword = function (target) {
	var keywords = ['abstract', 'as', 'base', 'byte', 'bool', 'break', 'case', 'catch', 'char', 'checked', 'class', 'const', 'continue',
                'decimal', 'default', 'delegate', 'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'false', 'for',
                'foreach', 'finally', 'fixed', 'float', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock',
                'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params', 'private', 'protected', 'public',
                'readonly', 'ref', 'return', 'sbyte', 'sealed', 'string', 'short', 'sizeof', 'stackalloc', 'static', 'struct', 'switch',
                'this', 'throw', 'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'virtual', 'volatile',
                'void', 'while'];
				
	for(var i = 0; i < keywords.length; i++ )
	{
		if( target == keywords[i] )
		{
			target = '@' + target;
			break;
		}
	}
	
	return target;
};
/*
** Get the last segment from path string.
** params: 
**     path: A path string.
*/
exports.getLastSegment = function(path){
	if(path.charAt(path.length - 1) == '/'){
		path = path.slice(0, -1);
	}

	var arr = path.split('/');

	return arr[arr.length - 1];
};