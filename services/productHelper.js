'use strict';
const models = require('../models');
const promise = require('bluebird');

// Check product status for order
exports.checkProductForOrder = function(productId) {
  return new promise(function(resolve, reject) {
    models.Product.findById(productId)
      .then(function(product) {
        product = JSON.parse(JSON.stringify(product));

        // Nếu sản phẩm này không tồn tại
        if (!product) {
          reject({
            message: 'Sản phẩm ID ' + productId + ' không tồn tại'
          });
        }
        // Nếu sản phẩm không available
        else if (product.status !== 'available' && product.status !== 'suspended') {
          reject({
            message: 'Sản phẩm ID ' + productId + ' không sẵn sàng để đặt hàng'
          });
        }

        return resolve(product);
      })
      .catch(function(err) {
        return reject(err);
      });
  });
};

exports.changeProductStatus = function(productId, statusToChange) {
  return new promise(function(resolve, reject) {
    models.Product.update({
        status: statusToChange
      }, {
        where: {
          id: productId
        }
      })
      .then(function(result) {
        return resolve(result);
      })
      .catch(function(err) {
        return reject(err);
      });
  });
};
