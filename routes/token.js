'use strict';
var passport = require('passport');
var express = require('express');
var rand = require('csprng');
var router = express.Router();

var redisHelper = require('../services/redisHelper');

var TOKEN_LENGTH = 32;

// POST Token
router.post('/', passport.authenticate('local', {
  session: false
}), function(req, res) {

  var access_token = rand(256, TOKEN_LENGTH);
  var timeToLive;

  if (req.body.rememberme) {
    timeToLive = 60 * 60 * 24 * 30;
  }
  else {
    timeToLive = 60 * 60 * 24;
  }

  var user = req.user.toJSON();

  delete user.password;

  user['access_token'] = access_token;
  user['expires_in'] = timeToLive;

  redisHelper.setex(access_token, user, timeToLive)
    .then(function(reply) {
      return res.status(200).json(user);
    })
    .catch(function(err) {
      return res.status(403).json(err);
    });

});

// Logout
router.get('/expire', function(req, res) {
  var access_token = extractTokenFromHeader(req.headers);

  redisHelper.del(access_token)
    .then(function(reply) {
      return res.status(200).json(reply);
    })
    .catch(function(err) {
      return res.status(400).json(err);
    });
});

// Functions
function extractTokenFromHeader(headers) {
  if (headers == null) throw new Error('Header is null');
  if (headers.authorization == null) throw new Error('Authorization header is null');

  var authorization = headers.authorization;
  var authArr = authorization.split(' ');
  if (authArr.length != 2) throw new Error('Authorization header value is not of length 2');

  // retrieve token
  var token = authArr[1];
  // 	if (token.length != TOKEN_LENGTH * 2) throw new Error('Token length is not the expected one');

  return token;
}

module.exports = router;
