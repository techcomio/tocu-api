'use strict';
const supertest = require('supertest'),
  api = supertest('http://tocu-api-dev-tranduchieu.c9.io'),
  access_token = '0315mq4563l3kcaum5dlbrli6us6efg116k8mhiq3924mdph89qt';

import {reCalculateOrder, reCalculateOrder2, reCalculateOrder3, reCalculateOrder4} from '../services/orderHelper';

let OrderParams = {
    "store": "ol",
    "shippingInfo": {
        "name": "Trần Đức Hiếu",
        "phone": "0904906903",
        "address": "P804, CT2A, KĐT Nghĩa Đô, ngõ 106 Hoàng Quốc Việt",
        "district": "Cầu Giấy",
        "city": "Hà Nội"
    },
    "shippingCost": 20000,
    "paymentMethod": "transfer",
    "status": "open",
    "subTotal": 400000,
    "percentageDiscount": 0,
    "fixedDiscount": 0,
    "totalDiscounts": 0,
    "total": 420000,
    "totalWeight": 500,
    "OrderLines": [{
        "product": {
            "id": 1,
            "onlineStore": true
        },
        "unitPrice": 400000,
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
  
  it('test function reCalculateOrder1', function(done) {
    reCalculateOrder(OrderParams, function(err, result) {
      console.log(result);
      if(err) return done(err);
      return done();
    });
  });
  
  it('test function reCalculateOrder2', function(done) {
    // if (reCalculateOrder2(OrderParams) instanceof Error) {
    //   done(reCalculateOrder2(OrderParams));
    // }
    throw new Error('ểw')
    return done();
  });
  
  it('test function reCalculateOrder3', function(done) {
    reCalculateOrder3(OrderParams, function(err, result) {
      console.log(result);
      if(err) return done(err);
      return done();
    });
  });

  it('test function reCalculateOrder4', function(done) {
    reCalculateOrder4(OrderParams)
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      done(err);
    });
  });

});
