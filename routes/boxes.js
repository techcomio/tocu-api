var models = require('../models');
var express = require('express');
var router = express.Router();

var promise = require('bluebird');

// List Box
router.get('/', function(req, res) {
  models.Box.findAll()
    .then(function(boxes) {
      var boxes = JSON.stringify(boxes);

      promise.map(JSON.parse(boxes), function(box) {
          if (box.type == 'product') {

            // Đếm số product trong box
            return models.Product.count({
                where: {
                  BoxId: box.id
                }
              })
              .then(function(productCount) {

                box['count'] = productCount;
                return box;

              })
              // Tiếp tục query 2 product mới nhất
              .then(function(box) {

                // Nếu box có sản phẩm
                if (box.count > 0) {
                  return models.Product.findAll({
                      where: {
                        BoxId: box.id
                      },
                      order: '"createdAt" DESC',
                      limit: 2
                    })
                    .then(function(latestProducts) {

                      box['latestPosts'] = latestProducts;
                      return box;
                    });
                }
                else {
                  box['latestPosts'] = [];
                  return box;
                }
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

function BoxFindById(id) {
  return models.Box.findById(id)
    .then(function(box) {
      return box;
    });
}

router.get('/:id', function(req, res) {
  var boxId = req.params.id;


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

module.exports = router;
