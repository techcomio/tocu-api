var models = require('../models');
var express = require('express');
var router = express.Router();

// List Box
router.get('/', function(req, res) {
  models.Box.findAll()
  .then(function(result) {
    res.status(200).json(result);
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

module.exports = router;
