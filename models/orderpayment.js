'use strict';
module.exports = function(sequelize, DataTypes) {
  var OrderPayment = sequelize.define('OrderPayment', {
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cashier: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        OrderPayment.belongsTo(models.Order);
      }
    }
  });

  // OrderPayment.sync({
  //   force: true
  // });

  return OrderPayment;
};