//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

var fs = require('fs');
var Logger = require('./utilities/logger');
var paths = require('./config').Constants.Paths;


module.exports = function() {
    clean(paths.CSharpPackage);
    clean(paths.CSharpZipPackage);
    clean(paths.ServerCSharpPackage);
    clean(paths.ServerCSharpZipPackage);
};

function clean(path){
    fs.readdir(path, function(err, subFolders){
        if(err!=null)
        {
            Logger.getInstance().logErr(err.message);
            return;
        }
        var currentTime = new Date().getTime()
        subFolders.forEach(function(subFolder)
        {
            fs.stat(path + subFolder,function(err,stat){
                if(err!=null)
                {
                    Logger.getInstance().logErr(err.message);
                    return;
                }
                if(currentTime - stat.birthtime.getTime() > 60*60*24){
                    try{
                        deleteFolderRecursive(path+subFolder);
                        Logger.getInstance().logSuc("Deleted "+path+subFolder);
                    } catch(e)
                    {
                        Logger.getInstance().logErr(e.message);
                    }
                }
            })
        });
    });
}

function deleteFolderRecursive(path) {
    if(fs.lstatSync(path).isFile())
    {
        fs.unlinkSync(path); 
        return;
    }

    var files = [];
    files = fs.readdirSync(path);
    files.forEach(function(file,index){
        var curPath = path + "/" + file;
        deleteFolderRecursive(curPath);
    });
    fs.rmdirSync(path);
};