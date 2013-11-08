'use strict';

var fs = require('fs'),
    _ = require('underscore'),
    files = require('./files-array.js');

module.exports = function(config) {
  fs.readFile(config, 'utf8', function(err, data){
    if (err) throw err;

    var hashedPaths = {},
        configRegex = /(?:\.config\({(.*?)}\))/,
        pathsRegex = /(?:paths:({(.*)}))/,
        content = data;

    files.forEach(function(file){
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