'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    itemId: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    UserId: {
      type:DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Like.belongsTo(models.User);
      }
    }
  });
  return Like;
};