'use strict';
let models = require('../models');
let policies = require('../services/policies');
let queryHelper = require('../services/queryHelper');

let express = require('express');
let router = express.Router();

// Create a Like
router.post('/', policies.isAuthenticated, function(req, res) {
  let BoxId = req.body.BoxId,
    UserId = req.user.id;

  models.BoxLike.findOrCreate({
      where: {
        BoxId: BoxId,
        UserId: UserId
      },
      defaults: {
        BoxId: BoxId,
        UserId: UserId
      }
    })
    .spread(function(like, created) {

      if (created === true) {
        return res.status(201).json(like);
      }
      else {
        return res.status(400).json({
          message: 'Bạn đã Like Box id ' + BoxId
        });
      }
    })
    .catch(function(error) {
      return res.status(400).json(error);
    });
});

// Check Like already exists
router.get('/check/:id', policies.isAuthenticated, function(req, res) {
  let BoxId = req.params.id,
    UserId = req.user.id;

  models.BoxLike.findOne({
      where: {
        UserId: UserId,
        BoxId: BoxId
      }
    })
    .then(function(like) {
      console.log(like);

      if (like == null) {
        return res.status(200).json(false);
      }
      else {
        return res.status(200).json(true);
      }
    });
});

// Item query
router.get('/', policies.isAuthenticated, queryHelper, function(req, res) {
  req.filters['UserId'] = req.user.id;

  models.BoxLike.findAll({
      where: req.filters,
      include: req.include,
      offset: req.skip,
      limit: req.limit,
      order: req.sort
    })
    .then(function(result) {
      return res.status(200).json(result);
    })
    .catch(function(err) {
      return res.status(400).json(err);
    });
});

// Count query
router.get('/count', queryHelper, function(req, res) {

  models.BoxLike.count({
      where: req.filters,
      include: req.include,
      offset: req.skip,
      limit: req.limit,
      order: req.sort
    })
    .then(function(result) {
      return res.status(200).json(result);
    })
    .catch(function(err) {
      return res.status(400).json(err);
    });
});

export default router;