'use strict'
const assert = require('assert');
const redisHelper = require('../services/redisHelper');

let key = 'verify-code-0904906903';

describe('Redis', function() {
  it('get redis value by key', function(done) {
    redisHelper.get('cart-2')
    .then(function(result) {
      console.log(result);
      // assert.equal(result.isFulfilled, false);
      return done();
    })
    .catch(function(err) {
      return done(err);
    });
  });
  
  it('delete value by key', function(done) {
    redisHelper.del(key)
    .then(function(reply) {
      console.log(reply);
      return done();
    })
    .catch(function(err) {
      return done(err);
    });
  });
  
  it('change key', function(done) {
    redisHelper.rename('cart-1', 'cart-2')
    .then(function(reply) {
      console.log(reply);
      return done();
    })
    .catch(function(err) {
      return done(err);
    });
  });
});