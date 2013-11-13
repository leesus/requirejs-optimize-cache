'use strict';

var should = require('should'),
    sinon = require('sinon'),
    fs = require('fs'),
    hashFiles = require('../../src/walker.js').hashFiles,
    cleanFiles = require('../../src/walker.js').cleanFiles;

describe('#cleanFiles()', function(){

  it('should exist', function(){
    (typeof cleanFiles).should.equal('function');
  });

  beforeEach(function(){
    var readFile = sinon.stub(fs, 'readFile');
  });

  afterEach(function () {
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

  describe('when fs.readFile() called', function(){

    it('should call hashFiles() with file data, stat object and callback', function(){
      var stats = {
            fileName: 'file1',
            extension: 'txt',
            moduleName: 'submodule1/file1',
            path: './test/submodule1/file1.txt',
            dogPoo: 'string'
          },          
          fileContent = '<li class="step">1</li><li class="step">2</li><li class="step">3</li>',
          next = sinon.spy(),
          hashFiles = sinon.stub();

      cleanFiles('../test_dir/submodule1', { name: 'file1.txt' }, next);

      next.called.should.equal.false;
      hashFiles.calledWith(fileContent, stats, next).should.equal.true;
    });

  });

});