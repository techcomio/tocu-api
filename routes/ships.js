var models = require('../models');
var consts = require('../services/consts');
var ship = require('../services/ship');
var express = require('express');
var router = express.Router();

// Ship calculator
router.get('/', function(req, res) {
  var city = req.query.city,
    district = req.query.district,
    weight = req.query.weight;

  // Nếu không có city hoặc district hoặc weight trả về badRequest
  if (!city || !district || !weight) {
    return res.status(400).json({
      message: 'invalid'
    });
  }

  // Nếu giao hàng trực tiếp thì trả về 20000 VND
  if (city == 'Hà Nội' && consts.districtsDirectShipping[district]) {
    return res.status(200).json({
      cost: 20000,
      shippingMethod: 'COD'
    });
  }

  // Sử dụng CPN Viettel
  models.District.findOne({
      where: {
        city: city,
        name: district
      }
    })
    .then(function(districtObj) {
      var Cost = ship.Cost(parseInt(weight), city, districtObj.isUrban);
      if (Cost == -1) {
        return res.status(404).json({
          message: 'The District or Weight hadn\'t supported'
        });
      }

      return res.status(200).json({
        cost: Cost,
        shippingMethod: 'CPN Viettel'
      });
    });
});

module.exports = router;
