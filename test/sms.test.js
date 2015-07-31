'use strict';
const SMS = require('../services/SMS'),
      Faker = require('Faker');

let mobilePhone = '0904906903',
    text = Faker.Lorem.sentence(10);

describe('SMS', function() {
  it('Send a SMS', function(done) {
    SMS.send(mobilePhone, text)
    .then(function(result) {
      console.log(result);
      return done();
    })
    .catch(function(err) {
      return done(err);
    })
  })
});
  