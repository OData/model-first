'use strict';

var fs      = require('fs'),
    path    = require('path');

module.exports = {
    updateSamples : updateSamples   
};

function updateSamples(content){
  return content.replace(/\/\/ sample[\s\S]*\/\/ endsample/, run('dist/samples', 'yaml'));
}

function run(dir, ext) {
  var list = fs.readdirSync(dir);
  var nlist = [];
  list.forEach(function(file){
    if (path.extname(file) === '.' + ext)
      nlist.push(file);
  });

  return JSON.stringify(nlist);
};
