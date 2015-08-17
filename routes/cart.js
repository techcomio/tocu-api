'use strict';
const policies = require('../services/policies');
const redisHelper = require('../services/redisHelper');
import crypto from 'crypto';
import {
  getCartById,
  pushOrCreateCart,
  pushNewCartLines,
  createCart,
  deleteCartLine
}
from '../services/cartHelper';

const express = require('express');
const router = express.Router();

// Push or Create cart
router.post('/:cartId?', function(req, res, next) {
  if (Array.isArray(req.body) === false) {
    return res.status(400).json({
      message: 'Data is not array'
    });
  }

  let cartId = req.params.cartId;

  if (cartId && isNaN(cartId)) {
    pushNewCartLines(cartId, req.body)
      .then(cartArray => {
        return res.status(201).json(cartArray);
      })
      .catch(err => {
        return res.status(400).json(err);
      });
  }
  else if (req.headers['authorization'] || isNaN(cartId) === false) {
    return next();
  }
  else {
    const randomBytes = crypto.randomBytes(10).toString('hex');

    return createCart(randomBytes, req.body)
      .then(result => {
        return res.status(201).json(result);
      })
      .catch(err => {
        return res.status(400).json(err);
      });
  }
}, policies.isAuthenticated, function(req, res) {
  pushOrCreateCart(req.user.id, req.body)
    .then(cartArray => {
      return res.status(201).json(cartArray);
    })
    .catch(err => {
      return res.status(400).json(err);
    });
});

// Delete a line
router.delete('/:productId/:cartId?', function(req, res, next) {
  let productId = req.params.productId;
  let cartId = req.params.cartId;

  if (cartId && isNaN(cartId)) {
    return deleteCartLine(cartId, productId)
      .then(result => {
        return res.status(200).json(result);
      })
      .catch(err => {
        return res.status(400).json(err);
      });
  }
  else if (req.headers['authorization'] || isNaN(cartId) === false) {
    return next();
  }
  else {
    return res.status(400).json({
      message: 'Vui lòng gửi kèm Cart ID'
    });
  }
}, policies.isAuthenticated, function(req, res) {
  return deleteCartLine(req.user.id, req.params.productId)
    .then(result => {
      return res.status(200).json(result);
    })
    .catch(err => {
      return res.status(400).json(err);
    });
});

// Get cart
router.get('/', policies.isAuthenticated, function(req, res) {
  let userId = req.user.id;
  let cartId = 'cart-' + userId;

  redisHelper.get(cartId)
    .then(cartArray => {
      return res.status(200).json(cartArray);
    })
    .catch(err => {
      return res.status(400).json(err);
    });
});

router.get('/:cartId?', function(req, res, next) {

  let cartId = req.params.cartId;
  if (cartId && isNaN(cartId)) {
    return getCartById(cartId)
      .then(cartArray => {
        return res.status(200).json(cartArray);
      })
      .catch(err => {
        return res.status(400).json(err);
      });
  }
  else if (req.headers['authorization'] || isNaN(cartId) === false) {
    return next();
  }
  else {

  }
}, policies.isAuthenticated, function(req, res) {
  return getCartById(req.user.id)
    .then(cartArray => {
      return res.status(200).json(cartArray);
    })
    .catch(err => {
      return res.status(400).json(err);
    });
});

export default router;