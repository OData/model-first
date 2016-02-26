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