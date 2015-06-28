var models = require('../models');
var express = require('express');
var router = express.Router();

// List Products
router.get('/', function(req, res) {
  models.Product.findAll({
    include: [models.Box, models.Model]
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
    .then(function(likeCount) {
      productJSON['like'] = likeCount;

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
