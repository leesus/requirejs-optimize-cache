'use strict';

var walker = require('./walker.js');

module.exports = init;

function init(directory, config, recurse) {
  var options = { followLinks: recurse || true };

  walker(directory, config, options);
}