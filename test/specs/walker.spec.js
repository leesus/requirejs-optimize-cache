'use strict';

var should = require('should'),
    sinon = require('sinon'),
    walker = require('../../src/walker.js').walker;

describe('#walker()', function(){

  it('should exist', function(){
    (typeof walker).should.equal('function');
  });

  it('should call #cleanFiles() for each file', function(done){
    done();
  });

  it('should call #transformConfig() when complete', function(done){
    done();
  });

});