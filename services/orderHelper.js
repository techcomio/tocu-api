'use strict';
const models = require('../models');
import {
  checkProductForOrder, changeProductStatus
}
from './productHelper';
import shipHelper from './shipHelper';
const promise = require('bluebird');


export function checkOrderForContinue(orderId) {
  return new promise(function(resolve, reject) {
    models.Order.findById(orderId)
      .then(function(order) {
        if (!order) {
          return reject({
            message: 'Order ID ' + orderId + ' không tồn tại'
          });
        }
        if (order.status == 'open' || order.status == 'processing' || order.status == 'pending') {
          return resolve(order);
        }
        else {
          return reject({
            message: 'Tình trạng Order này không cho phép bạn thêm sản phẩm'
          });
        }
      })
      .catch(function(err) {
        return reject(err);
      });
  });
}

export function OrderLineCreate(Order, OrderLine) {
  return new promise(function(resolve, reject) {
    OrderLine['OrderId'] = Order.id;
    OrderLine['UserId'] = Order.UserId;

    // Check product status
    let productId = OrderLine.product.id;

    return checkProductForOrder(productId)
      .then(function(product) {

        OrderLine.product['name'] = product.boxName;
        OrderLine.product['code'] = product.code;
        OrderLine.product['imageUrl'] = product.images[0] || null;

        // Create OrderLine
        return models.OrderLine.create(OrderLine)
          .then(function(result) {
            return resolve(result);
          })
          .catch(function(err) {
            throw err;
          });
      })
      .catch(function(err) {
        return reject(err);
      });

  });
}

export function OrderLinesBulkCreate(Order, OrderLinesParams) {
  return new promise(function(resolve, reject) {
    promise.map(OrderLinesParams, function(OrderLine) {
        return OrderLineCreate(Order, OrderLine)
          .then(function(result) {
            return result;
          })
          .catch(function(err) {
            throw err;
          });
      })
      .then(function(result) {
        // Change products status
        return promise.map(result, function(OrderLineResult) {
          changeProductStatus(OrderLineResult.product.id, 'sold')
            .then(function() {
              return resolve(result);
            })
            .catch(function(err) {
              throw err;
            });
        });
      })
      .catch(function(err) {
        // TODO: delete all OrderLines created
        return reject(err);
      });
  });
}

export function updateOrderAfterAddOrderLine(order, OrderLineObj) {
  let newWeight, newShippingCost, newTotal, newAmount;
  return new promise(function(resolve, reject) {
    newWeight = order.totalWeight + OrderLineObj.weight;
    // Tính lại phí ship
    return shipHelper(order.shippingInfo.city, order.shippingInfo.district, newWeight)
      .then(function(shipResult) {
        // Tính lại tổng tiền đơn hàng
        newShippingCost = shipResult.cost;
        newTotal = order.total - order.shippingCost + newShippingCost + OrderLineObj.amount;
        newAmount = newTotal;
        console.log(newShippingCost);
        // Update Order
        return models.Order.update({
            totalWeight: newWeight,
            shippingCost: newShippingCost,
            total: newTotal,
            amount: newAmount
          }, {
            where: {
              id: order.id
            }
          })
          .then(function(reply) {
            return resolve(reply);
          })
          .catch(function(err) {
            console.log(err);
            throw err;
          });
      })
      .catch(function(err) {
        return reject(err);
      });
  });
}

export function reCalculateOrder3(order, callback) {
  let total = order.total,
    subTotal = order.subTotal,
    shippingCost = order.shippingCost,
    percentageDiscount = order.percentageDiscount,
    fixedDiscount = order.fixedDiscount,
    totalDiscounts = order.totalDiscounts,
    OrderLines = order.OrderLines;


  // Tính tổng OrderLines
  let totalLinesAmount = 0;
  for (let i = 0; i < OrderLines.length; i++) {
    let line = OrderLines[i];
    if (line.unitPrice * line.quantity !== line.amount) {
      return callback('OrderLine amount không đúng');
    }

    totalLinesAmount += line.amount;
  }

  if (totalLinesAmount !== subTotal) {
    return callback('subTotal không đúng');
  }

  // Tính totalDiscounts
  if (percentageDiscount !== 0 || fixedDiscount !== 0 || totalDiscounts !== 0) {
    if (totalDiscounts !== (subTotal * percentageDiscount / 100 + fixedDiscount)) {
      return callback('totalDiscounts không đúng');
    }
  }

  // Tính total
  if (total !== subTotal + shippingCost - totalDiscounts) {
    return callback('total không đúng');
  }


  return callback(null, true);
}

export function reCalculateOrder(order) {
  return new promise((resolve, reject) => {
    let total = order.total,
      subTotal = order.subTotal,
      shippingCost = order.shippingCost,
      percentageDiscount = order.percentageDiscount,
      fixedDiscount = order.fixedDiscount,
      totalDiscounts = order.totalDiscounts,
      OrderLines = order.OrderLines;


    // Tính tổng OrderLines
    let totalLinesAmount = 0;
    for (let i = 0; i < OrderLines.length; i++) {
      let line = OrderLines[i];
      if (line.unitPrice * line.quantity !== line.amount) {
        return reject('OrderLine amount không đúng');
      }

      totalLinesAmount += line.amount;
    }

    if (totalLinesAmount !== subTotal) {
      return reject('subTotal không đúng');
    }

    // Tính totalDiscounts
    if (percentageDiscount !== 0 || fixedDiscount !== 0 || totalDiscounts !== 0) {
      if (totalDiscounts !== (subTotal * percentageDiscount / 100 + fixedDiscount)) {
        return reject('totalDiscounts không đúng');
      }
    }

    // Tính total
    if (total !== subTotal + shippingCost - totalDiscounts) {
      return reject('total không đúng');
    }


    return resolve(true);
  });

}
