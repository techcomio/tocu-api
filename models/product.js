'use strict';
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    BoxId: DataTypes.INTEGER,
    code: DataTypes.STRING,
    status: DataTypes.STRING,
    price: DataTypes.INTEGER,
    salePrice: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    ModelId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Product.belongsTo(models.Model);
        Product.belongsTo(models.Box);
      }
    }
  });
  return Product;
};
