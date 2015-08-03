'use strict';
const models = require('../models');
import {checkProductForOrder, changeProductStatus} from './productHelper';
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
        if (Order.paymentMethod == 'cod') {
          OrderLine['status'] = 'processing';
        }
        else {
          OrderLine['status'] = 'pending';
        }

        OrderLine.product['name'] = product.boxName;
        OrderLine.product['code'] = product.code;
        OrderLine.product['imageUrl'] = product.images[0] || null;

        // findOrCreate OrderLine
        return models.OrderLine.findOrCreate({
            where: {
              product: {
                id: productId.toString()
              },
              UserId: Order.UserId
            },
            defaults: OrderLine
          })
          .spread(function(result, created) {

            // Tạo OrderLine thành công
            if (created === true) {
              return resolve(result);
            }
            else {
              // User đã order sản phẩm này
              throw {
                message: 'Bạn đã đặt hàng sản phẩm ' + OrderLine.product.name + ' - ' + OrderLine.product.code
              };
            }
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
          console.log(OrderLineResult);
          let productStatusToChange;
          if (OrderLineResult.status == 'processing') {
            productStatusToChange = 'sold';
          }
          else {
            productStatusToChange = 'suspended';
          }
          changeProductStatus(OrderLineResult.product.id, productStatusToChange)
            .then(function() {
              return resolve(result);
            })
            .catch(function(err) {
              throw err;
            });
        });
      })
      .catch(function(err) {
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

