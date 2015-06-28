var models = require('../models');
var express = require('express');
var router = express.Router();

// Find District
router.post('/', function(req, res) {
  var city = req.body.city;
  var district = req.body.district;

  if(!district) {
    models.District.findAll({where: {city: city}})
    .then(function(districts) {
      res.status(200).json(districts);
    })
    .catch(function(error) {
      res.status(400).json(error);
    });
  } else {
    models.District.findAll({where: {city: city, name: district}})
    .then(function(districts) {
      res.status(200).json(districts);
    })
    .catch(function(error) {
      res.status(400).json(error);
    });
  }

});

module.exports = router;
