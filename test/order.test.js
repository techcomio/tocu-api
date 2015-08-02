'use strict';
const supertest = require('supertest'),
  api = supertest('http://tocu-api-dev-tranduchieu.c9.io'),
  access_token = '0315mq4563l3kcaum5dlbrli6us6efg116k8mhiq3924mdph89qt';

let OrderParams = {
  "store": "ol",
  "shippingInfo": {
    "name": "Trần Đức Hiếu",
    "phone": "0904906903",
    "company": "Techcom",
    "address": "P804, CT2A, KĐT Nghĩa Đô, ngõ 106 Hoàng Quốc Việt",
    "district": "Cầu Giấy",
    "city": "Hà Nội"
  },
  "shippingMethod": "delivery",
  "shippingCost": 20000,
  "paymentMethod": "transfer",
  "status": "open",
  "total": 400000,
  "percentageDiscount": 0,
  "fixedDiscount": 0,
  "amount": 420000,
  "totalWeight": 500,
  "OrderLines": [{
    "product": {
      "id": 11,
      "onlineStore": true
    },
    "unitPrice": 200000,
    "quantity": 1,
    "amount": 200000,
    "weight": 500
  }]
};

let OrderLineParams = {
    "OrderId": 3,
    "product": {
        "id": 18,
        "onlineStore": true
    },
    "unitPrice": 200000,
    "quantity": 1,
    "amount": 200000,
    "weight": 500
};

describe('Order', function() {
  it('get an order', function(done) {
    api.get('/order/1')
      .set('Authorization', 'Bearer ' + access_token)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);

        done();
      });
  });

  it('create an order return 201', function(done) {
    api.post('/order')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + access_token)
      .send(OrderParams)
      .expect(201)
      .end(function(err, res) {
        console.log(res.body);
        if (err) {
          return done(err);
        }
        done();
      });
  });
  
  it('create an orderline return 201', function(done) {
    api.post('/orderline')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + access_token)
      .send(OrderLineParams)
      .expect(201)
      .end(function(err, res) {
        console.log(res.body);
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
