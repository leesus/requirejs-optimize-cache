'use strict';

var walker = require('./src/walker.js');

module.exports = init;

function init(directory, config, recurse) {
  var options = { followLinks: recurse || true };

  walker(directory, config, options);
}