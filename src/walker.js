'use strict';

// dependencies
var walk = require('walk'),
	fs = require('fs'),
	md5 = require('md5'),
	_ = require('underscore');

// module vars
var filesArray = [],
	directory,
	config;

// export main module
exports.walker = walker;
// export sub-modules for testing purposes
if (process.env.NODE_ENV === 'test') {
	exports.cleanFiles = cleanFiles;
	exports.hashFiles = hashFiles;
	exports.filesArray = filesArray;
	exports.transformConfig = transformConfig;
}


function walker(directory, config, options) {
  var walker = walk.walk(directory, options);
  directory = directory;
  config = config;

  walker.on('file', cleanFiles);
  walker.on('end', transformConfig);
}

function cleanFiles(basedir, stat, next) {
    // given ./test/submodule1/file1.txt
    var file = stat.name, //file1.txt
        path = basedir + '/' + file, //./test/submodule1/file1.txt
        basedir = basedir.replace(directory + '/', ''), //submodule1
        fileName = file.substring(0, file.lastIndexOf('.')), //file1
        extension = file.substring(file.lastIndexOf('.') + 1, file.length),//txt
        moduleName =  basedir + '/' + fileName, //submodule1/file1
        stats;

    stats = {
      fileName: fileName,
      extension: extension,
      moduleName: moduleName,
      path: path,
      dir: directory
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

function hashFiles(file, stats, next) {
  var fileMD5 = md5(file),
      newFileName;
  stats.md5 = fileMD5;

  newFileName = stats.dir + '/' + stats.moduleName + '.' + stats.md5 + '.' + stats.extension;
  
  filesArray.push(stats);
  fs.rename(stats.path, newFileName, file, function(err){
    if (err) throw err;
  });

  next();
}

function transformConfig() {
  fs.readFile(config, 'utf8', function(err, data){
    if (err) throw err;

    var hashedPaths = {},
        configRegex = /(?:\.config\({(.*?)}\))/,
        pathsRegex = /(?:paths:({(.*)}))/,
        content = data;

    filesArray.forEach(function(file){
      hashedPaths[file.moduleName] =  file.moduleName + '.' + file.md5;
    });

    // Get config options
    if (configRegex.test(content)) {
      var options = content.match(configRegex)[1],
          transformedOptions = options,
          paths,
          transformedPaths,
          pathsJS;

      // Test for existing paths object & merge or create
      if (pathsRegex.test(options)) {
        paths = options.match(pathsRegex)[1];
        pathsJS = JSON.parse(paths);
        _.extend(pathsJS, hashedPaths);
        transformedPaths = JSON.stringify(pathsJS);
        transformedOptions = transformedOptions.replace(paths, transformedPaths);
      } else {
        transformedOptions += ',paths:';
        transformedOptions += JSON.stringify(hashedPaths);
      }
      content = content.replace(options, transformedOptions);
    }

    fs.writeFile(config, content, 'utf8', function(err) {
      if (err) throw err;
    });
  });
}
