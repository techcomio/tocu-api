'use strict'
const models = require('../models');
const policies = require('../services/policies');

const promise = require('bluebird');

exports.checkOrderForContinue = function(orderId) {
  return new promise(function(resolve, reject) {
    models.Order.findById(orderId)
    .then(function(order) {
      
    })
    catch(function(err) {
      
    });
  });
}