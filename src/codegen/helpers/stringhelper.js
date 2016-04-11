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