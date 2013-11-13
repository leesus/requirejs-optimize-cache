'use strict';

var should = require('should'),
    sinon = require('sinon'),
    md5 = require('md5'),
    files = require('../../src/files-array.js'),
    fs = require('fs'),
    hashFiles = require('../../src/hash-files.js');

describe('#hashFiles()', function(){

  it('should exist', function(){
    (typeof hashFiles).should.equal('function');
  });

  beforeEach(function(){
    sinon.stub(fs, 'rename');

    this.fileContent = '<li class="step">1</li><li class="step">2</li><li class="step">3</li>';
    this.stats = {
      fileName: 'file1',
      extension: 'txt',
      moduleName: 'submodule1/file1',
      path: './test/submodule1/file1.txt',
      dir: './test'
    };
    this.next = sinon.spy();
  });

  afterEach(function () {
    fs.rename.restore();
  });

  describe('when passed a file', function(){

    it('should hash the file contents', function(){
      var testHash = md5(this.fileContent);
      hashFiles(this.fileContent, this.stats, this.next);

      this.stats.md5.should.equal(testHash);
      this.next.called.should.equal.true;
    });

    it('should add the file stats to the global files array', function(){
      files.length = 0;
      files.length.should.equal(0);

      hashFiles(this.fileContent, this.stats, this.next);

      files.length.should.equal(1);
    });

    it('should call fs.rename() with the hash before the extension', function(){
      var testHash = md5(this.fileContent),
          testPath = './test/submodule1/file1.' + testHash + '.txt',
          calledOrigPath,
          calledHashPath;
      hashFiles(this.fileContent, this.stats, this.next);

      fs.rename.called.should.equal.true;
      calledOrigPath = fs.rename.getCall(0).args[0];
      calledHashPath = fs.rename.getCall(0).args[1];
      calledOrigPath.should.equal(this.stats.path);
      calledHashPath.should.equal(testPath);
    });

    it('should call the callback', function(){
      hashFiles(this.fileContent, this.stats, this.next);

      this.next.called.should.equal.true;
    });

  });

});