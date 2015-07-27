'use strict';
var models = require('../models');
var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING
    },
    description: DataTypes.TEXT,
    BoxId: DataTypes.INTEGER,
    boxName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ['draft', 'available', 'suspended', 'sold', 'closed'],
      defaultValue: 'available'
    },
    price: DataTypes.INTEGER,
    salePrice: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    ModelId: DataTypes.INTEGER,
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    }
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

