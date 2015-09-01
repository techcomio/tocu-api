'use strict';
let env = process.env.NODE_ENV || 'development';
let testConfig = require('../config/test.json')[env];

const supertest = require('supertest'),
  api = supertest('http://tocu-api-dev-tranduchieu.c9.io'),
  access_token = testConfig['access_token'];

let params = [{
  "id": 1,
  "code": "CV1",
  "boxName": "Chân váy",
  "imageUrl": "https://ni-c.github.io/heimcontrol.js/",
  "price": 120000,
  "salePrice": 100000,
  "weight": 500,
  "quantity": 1,
  "status": "available"
}, {
  "id": 2,
  "code": "CV1",
  "boxName": "Chân váy",
  "imageUrl": "https://ni-c.github.io/heimcontrol.js/",
  "price": 120000,
  "salePrice": 100000,
  "weight": 500,
  "quantity": 1,
  "status": "available"
}];

let newLineObj = [{
  "id": 7,
  "code": "CV1",
  "boxName": "Chân váy",
  "imageUrl": "https://ni-c.github.io/heimcontrol.js/",
  "price": 120000,
  "salePrice": 100000,
  "weight": 500,
  "quantity": 1,
  "status": "available"
}];

let checkoutInfo = {
  "shippingInfo": {
    "name": "Trần Đức Hiếu",
    "phone": "0904906903",
    "address": "P804, CT2A, KĐT Nghĩa Đô, ngõ 106 Hoàng Quốc Việt",
    "district": "Cầu Giấy",
    "city": "Hà Nội"
  },
  "paymentMethod": "atmCard"
};

describe('Cart', function() {
  it('push or create cart line return 201', function(done) {
    api.post('/cart/line')
      .set('Content-Type', 'application/json')
      // .set('Authorization', 'Bearer ' + access_token)
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
  it('get cart by user', function(done) {
    api.get('/cart/287884f3b2b8e07629ea')
      // .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);

        if (err) return done(err);

        done();
      });
  });
  it('delete a cart line', function(done) {
    api.delete('/cart/line/2/287884f3b2b8e07629ea')
      .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);

        if (err) return done(err);
        done();
      });
  });
  it('update a cart line', function(done) {
    api.put('/cart/line/287884f3b2b8e07629ea')
      // .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        if (err) return done(err);
        done();
      });
  });
  it('update checkout info', function(done) {
    api.put('/cart/checkout/17700cc2df94d13175a2')
      // .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .send(checkoutInfo)
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        if (err) return done(err);
        done();
      });
  });
});
