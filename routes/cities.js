var consts = require("../services/consts.js");
var express = require('express');
var router = express.Router();

// Find District
router.get('/', function(req, res) {
  return res.status(200).json(consts.city);
});

module.exports = router;
