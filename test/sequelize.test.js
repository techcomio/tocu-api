'use strict';
const models = require('../models');
const policies = require('../services/policies');

const promise = require('bluebird');

// findOrCreate OrderLine
let OrderLineParams = {
        "product": {
            "id": 1,
            "storeOffline": false,
            "name": "Chân váy",
            "code": "CV1",
            "image": "http://tocu-api-dev-tranduchieu.c9.io/image/2015/07/b6208c164ecb7ee4db81-7-4.jpg"
        },
        "unitPrice": 200000,
        "quantity": 1,
        "amount": 200000,
        "status": "open" 
    };

/*models.OrderLine.findOrCreate({
    where: {
      product: {
        id: 7
      },
      UserId: 1
    },
    defaults: OrderLineParams
  })
  .spread(function(OrderLine, created) {

    if (created === true) {
      return console.log(OrderLine);
    }
    else {
      return console.log({
        message: 'Bạn đã đặt hàng sản phẩm này'
      });
    }
  })
  .catch(function(err) {
    console.log(err);
  });*/
  
    models.Product.update({
      status: 'suspended'
    }, {
      where: {
        id: 16
      }
    })
    .then(function(result) {
      return console.log(result);
    })
    .catch(function(err) {
      return console.log(err);
    });