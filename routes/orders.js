'use strict';
const queryHelper = require('../services/queryHelper');
const models = require('../models');
const policies = require('../services/policies');
const redisHelper = require('../services/redisHelper');
import {OrderLinesBulkCreate} from '../services/orderHelper';


const promise = require('bluebird');

const express = require('express');
const router = express.Router();

// Create a order
router.post('/', policies.isAuthenticated, function(req, res) {
  let OrderParams = req.body;
  let UserId = req.user.id;

  OrderParams['UserId'] = UserId;

  OrderParams['createdBy'] = OrderParams['updatedBy'] = {
    id: req.user.id,
    name: req.user.name,
    avatarUrl: req.user.avatarUrl
  };

  // Tạo order
  models.Order.create(OrderParams)
    .then(function(order) {
      let orderJSON = order.toJSON();

      // Tạo các OrderLines kết hợp cập nhật User address với promise all
      return promise.all([
          OrderLinesBulkCreate(orderJSON, OrderParams.OrderLines),
          updateUserAdress(req.user, orderJSON.shippingInfo)
        ])
        .then(function(result) {
          orderJSON['OrderLines'] = result[0];
          return res.status(201).json(orderJSON);
        })
        .catch(function(err) {
          console.log('Errorrrrr: ' + err);
          order.destroy().then(function() {
            console.log('Order ID ' + orderJSON.id + ' deleted');
            return res.status(400).json(err);
          });
        });

    })
    .catch(function(err) {
      return res.status(400).json(err);
    });
});

// Get a order
router.get('/:id', policies.isAuthenticated, function(req, res) {
  let orderId = req.params.id;
  let userId = req.user.id;
  let userLevel = req.user.level;

  models.Order.findById(orderId, {
      include: [models.OrderLine]
    })
    .then(function(order) {
      if (userLevel <= 9 && userId !== order.createdBy.id) {
        return res.status(404).json({
          message: 'Bạn không được phép truy cập order này'
        });
      }
      return res.status(200).json(order);

    })
    .catch(function(err) {
      return res.status(400).json(err);
    });
});

// Query orders
router.get('/', policies.isAuthenticated, queryHelper, function(req, res) {
  console.log(req.user);
  if (req.user.level <= 9) {
    req.filters['UserId'] = req.user.id;
  }
  models.Order.findAll({
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

// Functions
function updateUserAdress(UserInfo, OrderShippingAddress) {
  return new promise(function(resolve, reject) {
    if (!UserInfo.address && OrderShippingAddress.district == UserInfo.district && OrderShippingAddress.city == UserInfo.city) {
      models.User.update({
          address: OrderShippingAddress.address,
          company: OrderShippingAddress.company
        }, {
          where: {
            id: UserInfo.id
          }
        })
        .then(function(userUpdated) {
          // update redis
          UserInfo.address = OrderShippingAddress.address;
          UserInfo.company = OrderShippingAddress.company;

          redisHelper.set(UserInfo.access_token, UserInfo)
            .then(function(result) {
              console.log(UserInfo);
              return resolve(UserInfo);
            })
            .catch(function(err) {
              return reject(err);
            });
        })
        .catch(function(err) {
          return reject(err);
        });
    }
    else {
      resolve(0);
    }
  });
}

export default router;