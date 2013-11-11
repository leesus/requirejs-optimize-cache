'use strict';

var should = require('should'),
    sinon = require('sinon'),
    fs = require('fs'),
    cleanFiles = require('../../src/clean-files.js');

describe('#cleanFiles()', function(){

  it('should exist', function(){
    (typeof cleanFiles).should.equal('function');
  });

  before(function(){
    sinon.stub(fs, 'readFile');
  });

  after(function () {
    fs.readFile.restore();
  });

  describe('when passed a file', function(){

    it('should call fs.readFile', function(){
      var next = sinon.spy(),
          rfCallback = sinon.spy();
      
      cleanFiles('../test_dir/submodule1', { name: 'file1.txt' }, next);

      next.called.should.equal.false;
      fs.readFile.calledWith('./test/submodule1/file1.txt', rfCallback).should.equal.true;
      rfCallback.called.should.equal.true;
    });

    it('should ignore config files or build summaries', function(){
      var next = sinon.spy(),
          rfCallback = sinon.spy();
      
      cleanFiles('../test_dir', { name: 'config.js' }, next);

      next.called.should.equal.true;
      fs.readFile.called.should.equal.false;
      rfCallback.called.should.equal.false;
      
      cleanFiles('../test_dir', { name: 'build.txt' }, next);

      next.called.should.equal.true;
      fs.readFile.called.should.equal.false;
      rfCallback.called.should.equal.false;
    });

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