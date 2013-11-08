'use strict';

var walk = require('walk');

module.exports = walker;

function walker(directory, config, options) {
  var walker = walk.walk(directory, options),
      // dependencies
      cleanFiles = require('./clean-files.js'),
      transformConfig = require('./transform-config.js')(config);

  walker.on('file', cleanFiles);
  walker.on('end', transformConfig);
}