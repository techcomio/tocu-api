'use strict';

module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('Order', {
    store: {
      type: DataTypes.ENUM,
      values: ['ol', 'hqv', 'mk'],
      defaultValue: 'ol',
      allowNull: false
    },
    UserId: DataTypes.INTEGER,
    shippingInfo: {
      type: DataTypes.JSONB,
      validate: {
        isShippingInfo: function(shippingInfoObj) {
          if (this.store === 'ol') {
            if (!shippingInfoObj.name || !shippingInfoObj.phone || !shippingInfoObj.address || !shippingInfoObj.district || !shippingInfoObj.city) {
              throw new Error('shippingInfo object invalid');
            }
          }
        }
      }
    },
    shippingMethod: {
      type: DataTypes.ENUM,
      values: ['atStore', 'cod', 'delivery'],
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM,
      values: ['cash', 'card', 'transfer'],
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['open', 'processing', 'pending', 'partialPaid', 'paid', 'sending', 'completed', 'failed', 'canceled'],
      defaultValue: 'open'
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    percentageDiscount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    fixedDiscount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalWeight: DataTypes.INTEGER,
    noteBySaleman: DataTypes.TEXT,
    createdBy: DataTypes.JSONB,
    updatedBy: DataTypes.JSONB
  }, {
    classMethods: {
      associate: function(models) {
        Order.hasMany(models.OrderLine);
      }
    }
  });

  // Before validate
  /*  Order.hook('beforeValidate', function(order, options, callback) {
      // callback(null, user);
      
      if(!order.store) return callback({message: 'store can not be empty'});
      
      order['code'] = storeConfig[order.store].code;
      
      return callback(null, order);
    });*/

  return Order;
};