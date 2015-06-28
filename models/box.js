'use strict';
module.exports = function(sequelize, DataTypes) {
  var Box = sequelize.define('Box', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      values: ['product', 'article', 'photo']
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Box;
};