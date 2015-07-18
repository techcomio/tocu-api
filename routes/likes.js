var models = require('../models');
var policies = require('../services/policies');

var express = require('express');
var router = express.Router();

// Create a Like
router.post('/', function(req, res) {
  var type = req.body.type,
  itemId = req.body.itemId,
  UserId = req.body.UserId;

  models.Like.findOrCreate({where: {type: type, itemId: itemId, UserId: UserId}, defaults: req.body})
  .spread(function(user, created) {

    if(created === true) {
      res.status(201).json(user);
    } else {
      return res.status(400).json({message: 'Bạn đã Like ' + type + ' id ' + itemId});
    }
  })
  .catch(function(error) {
    return res.status(400).json(error);
  });
});

// Get all Like
router.get('/', function(req, res) {
  models.Like.findAll()
  .then(function(users) {
    return res.status(200).json(users);
  });
});

// Count Likes by Post
router.get('/:type/:id', function(req, res) {
  var type = req.params.type,
  id = req.params.id;

  models.Like.count({where: {type: type, itemId: id}})
  .then(function(result) {
    return res.status(200).json(result);
  });
});

module.exports = router;
