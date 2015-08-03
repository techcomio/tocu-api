'use strict';
let models = require('../models');
let policies = require('../services/policies');
let queryHelper = require('../services/queryHelper');

let express = require('express');
let router = express.Router();

// Create a Like
router.post('/', policies.isAuthenticated, function(req, res) {
  let ProductId = req.body.ProductId,
    UserId = req.user.id;

  models.ProductLike.findOrCreate({
      where: {
        ProductId: ProductId,
        UserId: UserId
      },
      defaults: {
        ProductId: ProductId,
        UserId: UserId
      }
    })
    .spread(function(like, created) {

      if (created === true) {
        return res.status(201).json(like);
      }
      else {
        return res.status(400).json({
          message: 'Bạn đã Like Product id ' + ProductId
        });
      }
    })
    .catch(function(error) {
      return res.status(400).json(error);
    });
});

// Check Like already exists
router.get('/check/:id', policies.isAuthenticated, function(req, res) {
  let ProductId = req.params.id,
    UserId = req.user.id;

  models.ProductLike.findOne({
      where: {
        UserId: UserId,
        ProductId: ProductId
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

  models.ProductLike.findAll({
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

  models.ProductLike.count({
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