var models = require('../models');
var express = require('express');
var router = express.Router();

// List Model
router.get('/', function(req, res) {
  models.Model.findAll()
  .then(function(result) {
    res.status(200).json(result);
  });
});
// Create a Model
router.post('/', function(req, res) {
  var name = req.body.name;
  models.Model.findOrCreate({where: {name: name}, defaults: req.body})
  .spread(function(model, created) {

    if(created === true) {
      res.status(201).json(model);
    } else {
      res.status(400).json({message: name + ' đã tồn tại.'})
    }
  })
  .catch(function(error) {
    res.status(400).json(error);
  })
});

module.exports = router;
