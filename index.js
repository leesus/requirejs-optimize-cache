#!/usr/bin/env node
var fs = require('fs'),
    md5 = require('MD5'),
    walk = require('walk'),
    _ = require('underscore'),
    argv = require('optimist').argv;

var dir = argv.dir,
    configFile = 'config.js',
    configFile = dir + '/' + configFile,
    options = {
      followLinks: true
    },
    files = [],
    cleanFiles = function(basedir, stat, next) {
      var file = stat.name, //file1.txt
          path = basedir + '/' + file, //./test/submodule2/file1.txt
          basedir = basedir.replace(dir + '/', ''), //submodule2
          fileName = file.substring(0, file.lastIndexOf('.')), //file1
          extension = file.substring(file.lastIndexOf('.') + 1, file.length),
          moduleName =  basedir + '/' + fileName, //submodule2/file1
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
    },
    hashFiles = function(file, stats, next) {
      var fileMD5 = md5(file),
          newFileName;
      stats.md5 = fileMD5;

      newFileName = dir + '/' + stats.moduleName + '.' + stats.md5 + '.' + stats.extension;
      
      files.push(stats);
      fs.rename(stats.path, newFileName, file, function(err){
        if (err) throw err;
      });

      next();
    },
    transformConfig = function(){
      fs.readFile(configFile, 'utf8', function(err, data){
        if (err) throw err;

        var hashedPaths = {},
            configRegex = /(?:\.config\({(.*?)}\))/,
            pathsRegex = /(?:paths:({(.*)}))/,
            content = data;

        files.forEach(function(file){
          //hashedPaths[file.fileName] =  file.moduleName + '.' + file.md5;
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

        fs.writeFile(configFile, content, 'utf8', function(err) {
          if (err) throw err;
        });
      });
    },
    walker;

walker = walk.walk(dir, options);

walker.on('file', cleanFiles);
walker.on('end', transformConfig);
