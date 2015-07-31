'use strict';
const models = require('../models');
const policies = require('../services/policies');
const productHelper = require('../services/productHelper');

const promise = require('bluebird');

const express = require('express');
const router = express.Router();

// Create a OrderLine
router.post('/', policies.isAuthenticated, function(req, res) {
  let UserId = req.user.id;
  let OrderLineParams = req.body;
  let productId = OrderLineParams.product.id;
  
  // Song song check product & order

  productHelper.checkProductForOrder(productId)
    .then(function(product) {
      if (product.status == 'available') {
        OrderLineParams['status'] = 'open';
      }
      else {
        OrderLineParams['status'] = 'suspended';
      }

      // findOrCreate OrderLine
      return models.OrderLine.findOrCreate({
          where: {
            product: {
              id: productId.toString()
            },
            UserId: UserId
          },
          defaults: OrderLineParams
        })
        .spread(function(result, created) {

          // Tạo OrderLine thành công
          if (created === true) {
            if (product.status == 'available') {
              productHelper.changeProductStatus()
              .then(function() {
                return res.status(201).json(result);
              })
              .catch(function(err) {
                throw err;
              });
            } else {
              return res.status(201).json(result);
            }
          }
          else {
            // User đã order sản phẩm này
            throw {
              message: 'Bạn đã đặt hàng sản phẩm ' + OrderLineParams.product.name + ' - ' + OrderLineParams.product.code
            };
          }
        })
        .catch(function(err) {
          throw err;
        });
    })
    .catch(function(err) {
      return res.status(400).json(err);
    });
});

function updateOrderAfterAddOrderLine(OrderId, OrderLineObj) {
  return new promise(function(resolve, reject) {
    models.Order.findById(OrderId)
    .then(function(order) {
      order = JSON.parse(JSON.stringify(order));
      
      let newWeight = order.totalWeight + OrderLineObj.weight;
      // Tính lại phí ship
      
    })
    .catch();
  });
}

module.exports = router;