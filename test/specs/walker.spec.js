'use strict';

var should = require('should'),
    sinon = require('sinon'),
    walker = require('../../src/walker.js');

describe('Directory walker', function(){

  it('should exist', function(){
    (typeof walker).should.equal('function');
  });

  /*describe('when walking a directory', function(){

    it('should call #cleanFiles() for each file', function(){
      var cleanFiles = sinon.spy(),
          dir = '../test_dir',
          config = dir + '/config.js',
          options = { followLinks: true };

      walker(dir, config, options);

      cleanFiles.called.should.equal(true);
    });

  });*/

});