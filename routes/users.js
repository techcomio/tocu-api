var models = require('../models');
var policies = require('../services/policies');

var express = require('express');
var router = express.Router();

// Create User
router.post('/', function(req, res) {
  models.User.findOrCreate({where: {mobilePhone: req.body.mobilePhone}, defaults: req.body})
  .spread(function(user, created) {

    if(created === true) {
      res.status(201).json(user);
    } else {
      res.status(400).json({message: 'Số điện thoại đã tồn tại.'})
    }
  })
  .catch(function(error) {
    res.status(400).json(error);
  })
});

// Get all user
router.get('/', policies.isAuthenticated, policies.isLevel100, function(req, res) {
  models.User.findAll()
  .then(function(users) {
    res.status(200).json(users);
  });
});

// Get me
router.get('/me', policies.isAuthenticated, function(req, res) {
  return res.status(200).json(req.user);
});

module.exports = router;
