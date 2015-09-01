'use strict';
module.exports = function(sequelize, DataTypes) {
  var Payment = sequelize.define('Payment', {
    UserId: {
      type: DataTypes.INTEGER
    },
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    method: {
      type: DataTypes.ENUM,
      values: ['cash', 'atmCard', 'debitCard', 'transfer'],
      allowNull: false
    },
    transactionNo: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false 
    },
    cashier: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    userIP: {
      type: DataTypes.STRING,
      validate: {
        isIP: true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Payment.belongsTo(models.Order);
      }
    }
  });

  // Payment.sync({
  //   force: true
  // });

  return Payment;
};