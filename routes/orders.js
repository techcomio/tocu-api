'use strict';
const models = require('../models');
const policies = require('../services/policies');
const redisHelper = require('../services/redisHelper');

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
          OrderLinesBulkCreate(orderJSON.id, UserId, OrderParams.OrderLines),
          updateUserAdress(req.user, orderJSON.shippingInfo)
        ])
        .then(function(result) {
          orderJSON['OrderLines'] = result[0];
          return res.status(201).json(orderJSON);
        })
        .catch(function(err) {
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

// Functions
function OrderLinesBulkCreate(OrderId, UserId, OrderLinesParams) {
  return new promise(function(resolve, reject) {
    promise.map(OrderLinesParams, function(OrderLine) {
        OrderLine['OrderId'] = OrderId;
        OrderLine['UserId'] = UserId;

        // Check product status
        let productId = OrderLine.product.id;

        return productStatus(productId)
          .then(function(status) {
            if (status == 'available') {
              changeProductToSuspended(productId);
              OrderLine['status'] = 'open';
            }
            else if (status == 'suspended') {
              OrderLine['status'] = 'suspended';
            }
            else {
              reject('Product ' + productId + ' not available');
            }

            return OrderLine;
          })
          .then(function(OrderLine) {

            // findOrCreate OrderLine
            return models.OrderLine.findOrCreate({
                where: {
                  product: {
                    id: productId.toString()
                  },
                  UserId: UserId
                },
                defaults: OrderLine
              })
              .spread(function(result, created) {

                if (created === true) {
                  return result;
                }
                else {
                  // User đã order sản phẩm này
                  reject({
                    message: 'Bạn đã đặt hàng sản phẩm ' + OrderLine.product.name + ' - ' + OrderLine.product.code
                  });
                }
              })
              .catch(function(err) {
                reject(err);
              });
          })
          .catch(function(err) {
            reject(err);
          });

      })
      .then(function(result) {
        return resolve(result);
      })
      .catch(function(err) {
        return reject(err);
      });
  });
}

function productStatus(productId) {
  return new promise(function(resolve, reject) {
    models.Product.findById(productId)
      .then(function(product) {
        product = JSON.parse(JSON.stringify(product));

        if (!product) {
          reject({
            message: 'Sản phẩm ID ' + productId + ' không tồn tại'
          });
        }

        return resolve(product.status);
      })
      .catch(function(err) {
        return reject(err);
      });
  });
}

function changeProductToSuspended(productId) {
  models.Product.update({
      status: 'suspended'
    }, {
      where: {
        id: productId
      }
    })
    .then(function(result) {
      return console.log(result);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

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

module.exports = router;