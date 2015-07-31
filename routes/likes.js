var models = require('../models');
var policies = require('../services/policies');

var express = require('express');
var router = express.Router();

// Create a Like
router.post('/', policies.isAuthenticated, function(req, res) {
  var type = req.body.type,
    itemId = req.body.itemId,
    UserId = req.user.id;

  models.Like.findOrCreate({
      where: {
        type: type,
        itemId: itemId,
        UserId: UserId
      },
      defaults: req.body
    })
    .spread(function(like, created) {

      if (created === true) {
        return res.status(201).json(like);
      }
      else {
        return res.status(400).json({
          message: 'Bạn đã Like ' + type + ' id ' + itemId
        });
      }
    })
    .catch(function(error) {
      return res.status(400).json(error);
    });
});

// Check Like already exists
router.get('/me/:type/:itemId', policies.isAuthenticated, function(req, res) {
  var type = req.params.type,
    itemId = req.params.itemId,
    UserId = req.user.id;

  models.Like.findOne({
    where: {
      UserId: UserId,
      type: type,
      itemId: itemId
    }
  })
  .then(function(like) {
    console.log(like);
    
    if(like == null) {
      return res.status(200).json(false);
    } else {
      return res.status(200).json(true);
    }
  });
});

// Get all Like
router.get('/', policies.isAuthenticated, policies.isLevel100, function(req, res) {
  models.Like.findAll()
    .then(function(users) {
      return res.status(200).json(users);
    });
});

// Count Likes by Post
router.get('/:type/:id', policies.isAuthenticated, function(req, res) {
  var type = req.params.type,
    id = req.params.id;

  models.Like.count({
      where: {
        type: type,
        itemId: id
      }
    })
    .then(function(result) {
      return res.status(200).json(result);
    });
});

module.exports = router;
