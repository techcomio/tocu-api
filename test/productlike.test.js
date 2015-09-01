'use strict';
let env = process.env.NODE_ENV || 'development';
let testConfig = require('../config/test.json')[env];

const supertest = require('supertest'),
  api = supertest('http://tocu-api-dev-tranduchieu.c9.io'),
  access_token = testConfig['access_token'];

let params = {
  ProductId: 8,
  UserId: 1
};

let query = 'filters=ProductId==2'

describe('ProductLike', function() {
  it('query like', function(done) {
    api.get('/productlike?' + query)
      .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);

        done();
      });
  });
  it('count like', function(done) {
    api.get('/productlike/count?' + query)
      .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);

        done();
      });
  });
  it('create a productlike return 201', function(done) {
    api.post('/productlike')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + access_token)
      .send(params)
      .expect(201)
      .end(function(err, res) {
        console.log(res.body);
        if (err) {
          return done(err);
        }
        done();
      });
  });
  it('check productlike already exists return true or false', function(done) {
    api.get('/productlike/check/17')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + access_token)
      .send(params)
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
