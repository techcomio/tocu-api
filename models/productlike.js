'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProductLike = sequelize.define('ProductLike', {
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        ProductLike.belongsTo(models.Product);
        ProductLike.belongsTo(models.User);
      }
    }
  });

  // ProductLike.sync({
  //   force: true
  // });

  return ProductLike;
};