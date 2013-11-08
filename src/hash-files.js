'use strict';

var fs = require('fs'),
    md5 = require('md5'),
    files = require('./files-array.js');

module.exports = hashFiles;

function hashFiles(file, stats, next) {
  var fileMD5 = md5(file),
      newFileName;
  stats.md5 = fileMD5;

  newFileName = dir + '/' + stats.moduleName + '.' + stats.md5 + '.' + stats.extension;
  
  files.push(stats);
  fs.rename(stats.path, newFileName, file, function(err){
    if (err) throw err;
  });

  next();
}