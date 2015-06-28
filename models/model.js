'use strict';

module.exports = function(sequelize, DataTypes) {
  var Model = sequelize.define('Model', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    height: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    bust: DataTypes.INTEGER,
    waist: DataTypes.INTEGER,
    hip: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Model.hasOne(models.Product);
      }
    }
  });
  return Model;
};
