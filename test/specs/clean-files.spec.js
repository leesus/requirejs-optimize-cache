'use strict';

var should = require('should'),
    sinon = require('sinon'),
    fs = require('fs'),
    hashFiles = require('../../src/hash-files.js');
    cleanFiles = require('../../src/clean-files.js');

describe('#cleanFiles()', function(){

  it('should exist', function(){
    (typeof cleanFiles).should.equal('function');
  });

  beforeEach(function(){
    var readFile = sinon.stub(fs, 'readFile'),
        hashFiles = sinon.stub('hashFiles');
    readFile.withArgs('./test/submodule1/file1.txt', function(err, file){}).yields()
  });

  afterEach(function () {
    fs.readFile.restore();
    hashFiles.restore();
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

    it('should ignore config files and build summary files', function(){
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

  describe('when calling fs.readFile()', function(){

    it('should pass the data to hashFiles()', function(){
      var callback = function(err, file){},
          fileContents = '<li class="step">1</li><li class="step">2</li><li class="step">3</li>';
      fs.readFile.withArgs('./test/submodule1/file1.txt', callback).returns(null, fileContents);
      fs.readFile.withArgs('./test/dogpoo', callback).returns(new Error(), null);

      
    });

    it('should handle errors', function(){

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