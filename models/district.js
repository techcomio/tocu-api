'use strict';
module.exports = function(sequelize, DataTypes) {
  var District = sequelize.define('District', {
    name: DataTypes.STRING,
    city: DataTypes.STRING,
    isUrban: DataTypes.BOOLEAN
  }, {
    timestamps: false
  },{
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return District;
};
