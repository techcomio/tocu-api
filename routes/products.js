'use strict';
const queryHelper = require('../services/queryHelper');
const models = require('../models');
const express = require('express');
const router = express.Router();

const promise = require('bluebird');

// Count all
router.get('/count', function(req, res) {
  models.Product.count({
      where: {
        status: ['available', 'suspended']
      }
    })
    .then(function(count) {
      return res.status(200).json(count);
    });
});

// List Products
router.get('/', function(req, res) {
  let skip = req.query.skip || 0,
    limit = req.query.limit || 20,
    filters = req.query.filters,
    sort = req.query.sort;

  let whereObj = queryHelper.extractFilters(filters);
  let sortArray = queryHelper.extractSort(sort);
  // if (req.query.)
  console.log(sort);
  models.Product.findAll({
      where: whereObj,
      include: [models.Box],
      offset: skip,
      limit: limit,
      order: sortArray
    })
    .then(function(result) {
      return res.status(200).json(result);
    });
});

// List Products by Box
router.get('/box/:id', function(req, res) {
  var boxId = req.params.id,
    skip = req.query.skip || 0,
    limit = req.query.limit || 20;

  models.Product.findAll({
      where: {
        BoxId: boxId
      },
      // include: [models.Box, models.Model],
      offset: skip,
      limit: limit
    })
    .then(function(result) {
      return res.status(200).json(result);
    });
});

// Get a Product
router.get('/:id', function(req, res) {
  var productId = req.params.id;

  promise.all([ProductFindById(productId), ProductLikesCount(productId)])
    .then(function(result) {
      result = JSON.stringify(result);

      var product = JSON.parse(result)[0];
      product['likesCount'] = JSON.parse(result)[1];

      return res.status(200).json(product);
    })
    .catch(function(err) {
      return res.status(400).json(err);
    });
});


// Create a Product
router.post('/', function(req, res) {
  var params = req.body;

  BoxFindById(params.BoxId)
    .then(function(box) {
      params['boxName'] = box.name;
      models.Product.create(params)
        .then(function(product) {
          return res.status(201).json(product);
        });
    })
    .catch(function(err) {
      return res.status(400).json(err);
    });
});

// Functions
function ProductFindById(productId) {
  return models.Product.findById(productId, {
      include: [models.Box, models.Model]
    })
    .then(function(product) {
      return product;
    });
}

function ProductLikesCount(productId) {
  return models.Like.count({
      where: {
        type: 'product',
        itemId: productId
      }
    })
    .then(function(likesCount) {
      return likesCount;
    });
}

function BoxFindById(boxId) {
  return new promise(function(resolve, reject) {
    models.Box.findById(boxId)
      .then(function(box) {
        return resolve(box);
      });
  });
}

module.exports = router;
