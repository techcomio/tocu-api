'use strict';
const models = require('../models');
const policies = require('../services/policies');
const SMS = require('../services/SMS');
const redisHelper = require('../services/redisHelper');
const crypto = require('crypto');
const rand = require('csprng');

const promise = require('bluebird');


const express = require('express');
const router = express.Router();

// Create User
router.post('/', function(req, res, next) {
  models.User.findOrCreate({
      where: {
        mobilePhone: req.body.mobilePhone
      },
      defaults: req.body
    })
    .spread(function(user, created) {

      if (created === true) {
        // res.status(201).json(user);
        req.user = user;
        return next();
      }
      else {
        return res.status(400).json({
          message: 'Số điện thoại đã tồn tại.'
        });
      }
    })
    .catch(function(error) {
      return res.status(400).json(error);
    });
}, function(req, res) {
  console.log(req.user);
  let access_token = rand(256, 32);
  let timeToLive = 60 * 60 * 24;


  let user = req.user.toJSON();

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

// Request verify
router.get('/verify', policies.isAuthenticated, function(req, res) {

  // Nếu tài khoản đã xác thực
  if (req.user.isVerifyMobilePhone) {
    return res.status(400).json({
      message: 'Số điện thoại ' + req.user.mobilePhone + ' đã xác thực'
    });
  }


  const timeToLive = 60 * 60 * 24;
  const maxCount = 5;
  let key = 'verify-code-' + req.user.mobilePhone;

  redisHelper.get(key)
    .then(function(codeObj) {
      if (codeObj && codeObj.count === maxCount) {
        return res.status(400).json({
          message: ' Đã gửi tối đa 5 lần tới số điện thoại ' + req.user.mobilePhone
        });
      }
      else {
        // Random code
        crypto.randomBytes(3, function(err, buffer) {
          if (err) return res.status(400).json(err);

          let code = parseInt(buffer.toString('hex'), 16).toString().substr(0, 6);
          SMS.send(req.user.mobilePhone, 'Ma xac thuc cua ban tai tocu.vn la ' + code)
            .then(function(result) {
              // Lưu thành mảng 5 code vào redis
              let newCodeObj = {};
              // if (codeObj)
              newCodeObj['count'] = codeObj ? (codeObj.count + 1) : 1;
              newCodeObj['latestCode'] = code;
              redisHelper.setex(key, newCodeObj, timeToLive)
                .then(function(reply) {
                  return res.status(200).json(result);
                })
                .catch(function(err) {
                  throw err;
                });
            })
            .catch(function(err) {
              throw err;
            });
        });
      }
    })
    .catch(function(err) {
      console.log(err);
      return res.status(400).json(err);
    });
});

// Verify
router.get('/verify/:code', policies.isAuthenticated, function(req, res) {
  let code = req.params.code;
  let key = 'verify-code-' + req.user.mobilePhone;
  let UserObj = req.user;

  redisHelper.get(key)
    .then(function(codeObj) {
      if (!codeObj || codeObj.latestCode !== code) {
        return res.status(400).json({
          message: 'Mã xác thực không đúng'
        });
      }
      else {
        // Update User database & redis
        UserObj.isVerifyMobilePhone = true;
        promise.all([
            models.User.update({
              isVerifyMobilePhone: true
            }, {
              where: {
                id: req.user.id
              }
            }),
            redisHelper.set(req.user.access_token, UserObj)
          ])
          .then(function(result) {
            return res.status(200).json(true);
          })
          .catch(function(err) {
            throw err;
          });
      }
    })
    .catch(function(err) {
      console.log(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
