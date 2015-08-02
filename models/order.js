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
    shippingCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    NoteId: {
      type: DataTypes.INTEGER
    },
    createdBy: DataTypes.JSONB,
    updatedBy: DataTypes.JSONB
  }, {
    classMethods: {
      associate: function(models) {
        Order.hasMany(models.OrderLine);
        Order.hasMany(models.OrderPayment);
        Order.belongsTo(models.Note);
        Order.belongsTo(models.User);
      }
    }
  });

  // Order.sync({
  //   force: true
  // });
  
  return Order;
};