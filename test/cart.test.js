'use strict';
const supertest = require('supertest'),
  api = supertest('http://tocu-api-dev-tranduchieu.c9.io'),
  access_token = '0315mq4563l3kcaum5dlbrli6us6efg116k8mhiq3924mdph89qt';

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
  "id": 3,
  "code": "CV1",
  "boxName": "Chân váy",
  "imageUrl": "https://ni-c.github.io/heimcontrol.js/",
  "price": 120000,
  "salePrice": 100000,
  "weight": 500,
  "quantity": 1,
  "status": "available"
}];

describe('Cart', function() {
  it('push or create cart line return 201', function(done) {
    api.post('/cart')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + access_token)
      .send(newLineObj)
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
        if (err) return done(err);
        console.log(res.body);

        done();
      });
  });
  it('delete a cart line', function(done) {
    api.delete('/cart/2/287884f3b2b8e07629ea')
      .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);

        done();
      });
  });
});
