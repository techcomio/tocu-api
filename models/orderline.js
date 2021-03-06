'use strict';
const promise = require('bluebird');
const validator = require('validator');

import {
  checkProductForOrder
}
from '../services/productHelper';

module.exports = function(sequelize, DataTypes) {
  var OrderLine = sequelize.define('OrderLine', {
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        isProductObject: function(productObj) {
          function idValidate() {
            if (validator.isInt(productObj.id) === false) {
              throw new Error('Product ID invalid');
            }
          }

          function nameValidate() {
            if (!productObj.name) {
              throw new Error('Product name invalid');
            }
          }

          function onlineStoreValidate() {
            if (validator.isBoolean(productObj.onlineStore) === false) {
              throw new Error('onlineStore field invalid');
            }
          }

          function codeValidate() {
            if (!productObj.code) {
              throw new Error('Product code invalid');
            }
          }

          function imageValidate() {
            if (validator.isURL(productObj.imageUrl) === false) {
              throw new Error('Product image URL invalid');
            }
          }
          return promise.all([idValidate(), nameValidate(), onlineStoreValidate(), codeValidate(), imageValidate()])
            .catch(function(err) {
              throw new Error(err);
            });
        }
      }
    },
    unitPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function(models) {
        OrderLine.belongsTo(models.User);
        OrderLine.belongsTo(models.Order);
      }
    }
  });

  // OrderLine.hook('afterValidate', function(params, options, callback) {
  //   return checkProductForOrder(params.product.id)
  //   .then(result => {
  //     return callback(null);
  //   })
  //   .catch(err => {
  //     return callback(err);
  //   });
  // });

  // OrderLine.sync({
  //   force: true
  // });

  return OrderLine;
};