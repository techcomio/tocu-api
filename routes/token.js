var passport = require('passport');
var express = require('express');
var router = express.Router();

// POST Token
router.post('/', passport.authenticate('local', { session: false }), function(req, res) {
  return res.send(req.user);
});

module.exports = router;
