'use strict';

var fs = require('fs'),
    hashFiles = require('./hash-files.js');

module.exports = cleanFiles;

function cleanFiles(basedir, stat, next) {
  // given ./test/submodule1/file1.txt
  var file = stat.name, //file1.txt
      path = basedir + '/' + file, //./test/submodule1/file1.txt
      //basedir = basedir.replace(dir + '/', ''), //submodule1
      fileName = file.substring(0, file.lastIndexOf('.')), //file1
      extension = file.substring(file.lastIndexOf('.') + 1, file.length),//txt
      moduleName =  basedir + '/' + fileName, //submodule1/file1
      stats;

  stats = {
    fileName: fileName,
    extension: extension,
    moduleName: moduleName,
    path: path
  }

  if (fileName === 'config' || fileName === 'build') {
    next();
  } else {
    fs.readFile(path, function(err, file) {
      if (err) throw err;
      hashFiles(file, stats, next);
    });
  }
}