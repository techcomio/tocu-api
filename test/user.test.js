'use strict';
const supertest = require('supertest'),
  api = supertest('http://tocu-api-dev-tranduchieu.c9.io'),
  access_token = '7qd6323cvoi6lgfm61iiti6skm9k2cbfbfmqurjv2eceei1ih21m';

let code = '541880';
let loginInfo = {
  mobilePhone: '0904906903',
  password: 'tocu911',
  rememberme: true,
  cartId: '861d1eb6ee0f6acfed7b'
};

let registerInfo = {
  mobilePhone: '0904906903',
  password: 'tocu911',
  name: 'Trần Đức Hiếu',
  city: 'Hà Nội',
  district: 'Cầu Giấy'
}

describe('User', function() {
  it('create an user return access_token', function(done) {
    api.post('/user')
      .set('Content-Type', 'application/json')
      .send(registerInfo)
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('get token with mobilePhone & password', function(done) {
    api.post('/token')
      .set('Content-Type', 'application/json')
      .send(loginInfo)
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('request verify mobilePhone', function(done) {
    api.get('/user/verify')
      .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        if (err) return done(err);
        done();
      });
  });

  it('verify mobilePhone with a code', function(done) {
    api.get('/user/verify/' + code)
      .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        if (err) return done(err);
        done();
      });
  });

});
