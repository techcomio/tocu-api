'use strict';
const crypto = require('crypto');

describe('crypto', function() {
  it('random 6 digi number', function(done) {
    crypto.randomBytes(3, function(err, buffer) {
      if (err) return done(err);
      console.log(parseInt(buffer.toString('hex'), 16).toString().substr(0, 6));
      done();
    });
  })
});