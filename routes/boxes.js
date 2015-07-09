var models = require('../models');
var express = require('express');
var router = express.Router();

var promise = require('bluebird');

// Count all
router.get('/count', function(req, res) {
  models.Box.count()
    .then(function(count) {
      return res.status(200).json(count);
    });
});


// List Box
router.get('/', function(req, res) {
  models.Box.findAll()
    .then(function(boxes) {
      boxes = JSON.stringify(boxes);

      promise.map(JSON.parse(boxes), function(box) {
          // Product type
          if (box.type == 'product') {

            return promise.all([BoxFind2latestProduct(box.id), BoxCountProduct(box.id), BoxCountLike(box.id)])
              .then(function(result) {
                result = JSON.stringify(result);

                box['latestPosts'] = JSON.parse(result)[0];
                box['postsCount'] = JSON.parse(result)[1];
                box['likesCount'] = JSON.parse(result)[2];

                return box;
              })
              .catch(function(err) {
                return err;
              });

          }
          else {
            return box;
          }

        })
        .then(function(newBoxes) {
          res.status(200).json(newBoxes);
        });
    });
});

// Get box detail
router.get('/:id', function(req, res) {
  var boxId = req.params.id;

  return promise.all([BoxFindById(boxId), BoxCountProduct(boxId), BoxCountLike(boxId)])
    .then(function(result) {
      result = JSON.stringify(result);

      var box = JSON.parse(result)[0];
      box['postsCount'] = JSON.parse(result)[1];
      box['likesCount'] = JSON.parse(result)[2];

      return res.status(200).json(box);
    })
    .catch(function(err) {
      return res.status(400).json(err);
    });
});

// Create a Box
router.post('/', function(req, res) {
  models.Box.create(req.body)
    .then(function(product) {
      res.status(201).json(product);
    })
    .catch(function(error) {
      res.status(400).json(error);
    });
});


// Functions
function BoxFindById(boxId) {
  return models.Box.findById(boxId)
    .then(function(box) {
      return box;
    });
}

function BoxCountProduct(boxId) {
  return models.Product.count({
      where: {
        BoxId: boxId
      }
    })
    .then(function(count) {
      return count;
    });
}

function BoxCountLike(boxId) {
  return models.Like.count({
      where: {
        type: 'box',
        itemId: boxId
      }
    })
    .then(function(count) {
      return count;
    });
}

function BoxFind2latestProduct(boxId) {
  return models.Product.findAll({
      where: {
        BoxId: boxId
      },
      order: '"createdAt" DESC',
      limit: 2
    })
    .then(function(latestProducts) {

      return latestProducts;
    });
}

module.exports = router;
