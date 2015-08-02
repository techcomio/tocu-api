'use strict';
const models = require('../models');
const policies = require('../services/policies');
// const orderHelper = require('../services/orderHelper');
import {checkOrderForContinue, OrderLineCreate, updateOrderAfterAddOrderLine} from '../services/orderHelper';
import {checkProductForOrder, changeProductStatus} from '../services/productHelper';

const promise = require('bluebird');

const express = require('express');
const router = express.Router();

// Create a OrderLine
router.post('/', policies.isAuthenticated, function(req, res) {
  let UserId = req.user.id;
  let OrderId = req.body.OrderId;
  let OrderLineParams = req.body;
  let productId = OrderLineParams.product.id;

  // Song song check product & order
  promise.all([
      checkOrderForContinue(OrderId),
      checkProductForOrder(productId)
    ])
    .then(function(result) {
      return OrderLineCreate(result[0], OrderLineParams)
        .then(function(OrderLineResult) {
          // Song song change product status & update order
          let productStatusToChange;
          if (OrderLineResult.status == 'processing') {
            productStatusToChange = 'sold';
          }
          else {
            productStatusToChange = 'suspended';
          }
          console.log(result[0]);
          return promise.all([
            updateOrderAfterAddOrderLine(result[0], OrderLineResult),
            changeProductStatus(productId, productStatusToChange)
          ])
          .then(function() {
              return res.status(201).json(OrderLineResult);
          })
          .catch(function(err) {
            // TODO: nếu lỗi thì xóa orderline
             throw err; 
          });
        })
        .catch(function(err) {
          throw err;
        });
    })
    .catch(function(err) {
      return res.status(400).json(err);
    });
});


module.exports = router;