var models = require('../models');
var express = require('express');
var router = express.Router();

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

  models.Product.findById(productId, {
    include: [models.Box, models.Model]
  })
  .then(function(product) {
    var productJSON = product.toJSON();

    // Count Like
    models.Like.count({where: {type: 'product', itemId: productJSON.id}})
    .then(function(likesCount) {
      productJSON['likesCount'] = likesCount;

      res.status(200).json(productJSON);
    });
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

module.exports = router;
