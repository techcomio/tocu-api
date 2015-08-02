'use strict';
import shipHelper from '../services/shipHelper';
const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  let city = req.query.city,
    district = req.query.district,
    weight = req.query.weight;
    
  shipHelper(city, district, weight)
  .then(function(result) {
    return res.status(200).json(result);
  })
  .catch(function(err) {
    return res.status(400).json(err);
  });
});

module.exports = router;
