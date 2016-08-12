//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

module.exports = DirectoryManager;

var fs = require('fs');

function DirectoryManager() {
    this.create = function (paths) {
        paths.forEach(function (path) {
            var directories = splitPath(path);
            for (var index in directories) {
                createFolder(directories[index]);
            }
        });
    };
}

function createFolder(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        console.log('Create the directory ' + path + ' successfully!');
    }
}

function splitPath(path) {
    var segments = path.split('/');
    var paths = [];
    var directory = '';
    for (var i in segments) {
        if (segments[i] === '' || segments[i] === '.' || segments[i] === '..') {
            directory += segments[i] + '/';
        } else {
            if (paths.length === 0) {
                directory += segments[i];
            } else {
                directory += paths[paths.length - 1] + '/' + segments[i];
            }

            paths.push(directory);
            directory = '';
        }
    }

    return paths;
}