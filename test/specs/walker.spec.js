'use strict';

var should = require('should'),
    sinon = require('sinon'),
    walker = require('../../src/walker.js'),

    cleanFiles = require('../../src/clean-files.js')('./test/test_dir');

describe('#walker()', function(){

  it('should exist', function(){
    (typeof walker).should.equal('function');
  });

  describe('when passed a directory', function(){

    it('should call #cleanFiles() for each file', function(done){
      var dir = './test/test_dir',
          config = dir + '/configwithoutpaths.js',
          options = { followLinks: true },
          cleanFiles = sinon.mock();

      walker(dir, config, options);
      (typeof cleanFiles).should.equal('function');
      cleanFiles.called.should.equal.true;
      cleanFiles.getCall(0).args[0].should.equal('./test/test_dir/submodule1/file1.txt');
      //cleanFiles.callCount.should.equal(3);
      done();
    });

  });

});