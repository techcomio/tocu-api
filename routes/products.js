var models = require('../models');
var express = require('express');
var router = express.Router();

var promise = require('bluebird');

// Count all
router.get('/count', function(req, res) {
  models.Product.count({
      where: {
        status: ['Available', 'Suspended']
      }
    })
    .then(function(count) {
      return res.status(200).json(count);
    });
});

// List Products
router.get('/', function(req, res) {
  var skip = req.query.skip || 0,
    limit = req.query.limit || 20;

  models.Product.findAll({
      include: [models.Box],
      offset: skip,
      limit: limit
    })
    .then(function(result) {
      res.status(200).json(result);
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
      res.status(200).json(result);
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
    
    res.status(200).json(product);
  })
  .catch(function(err) {
    res.status(400).json(err);
  });
});


// Create a Product
router.post('/', function(req, res) {
  models.Product.create(req.body)
    .then(function(product) {
      res.status(201).json(product);
    })
    .catch(function(error) {
      res.status(400).json(error);
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
module.exports = router;
