'use strict';
import sequelize from 'sequelize';

module.exports = function(sequelize, DataTypes) {
  var BoxLike = sequelize.define('BoxLike', {
    BoxId: {
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
        BoxLike.belongsTo(models.Box);
        BoxLike.belongsTo(models.User);
      }
    }
  });

  // BoxLike.sync({
  //   force: true
  // });

  return BoxLike;
};