#!/usr/bin/env node

var program = require('commander'),
    optimizer = require('../index.js'),
    pkg = require('../package.json');

init();

function init() {
  program
    .version(pkg.version)
    .usage('[options] <directory> <config file>')
    .option(
      '-r, --recursive [boolean]',
      'Add hash to files in sub-folders of directory [true]',
      true
    )
    .parse(process.argv);

  runOptimizer();
}

function runOptimizer(){
  var recursive = program.recursive,
      directory = program.args[0],
      config = program.args[1];

  optimizer(directory, config, recursive);
}