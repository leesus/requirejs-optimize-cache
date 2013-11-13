'use strict';

var should = require('should'),
    sinon = require('sinon'),
    transformConfig = require('../../src/walker.js').transformConfig;

describe('#transformConfig()', function(){

  it('should exist', function(){
    (typeof transformConfig).should.equal('function');
  });

  it('should merge paths object with existing paths object if present in config', function(done){
    done();
  });

  it('should add paths object if not present in config', function(done){
    done();
  });

});