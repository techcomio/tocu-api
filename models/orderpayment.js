'use strict';
module.exports = function(sequelize, DataTypes) {
  var OrderPayment = sequelize.define('OrderPayment', {
    UserId: {
      type: DataTypes.INTEGER
    },
    OrderId: {
      type: DataTypes.INTEGER,
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
        OrderPayment.belongsTo(models.Order);
      }
    }
  });

  // OrderPayment.sync({
  //   force: true
  // });

  return OrderPayment;
};