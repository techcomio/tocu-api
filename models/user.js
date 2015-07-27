'use strict';

var bcrypt = require('bcrypt');
var Promise = require("bluebird");

var randomAvatar = require('../services/randomAvatar');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    mobilePhone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^(091|094|0123|0125|0127|0129|090|093|0122|0126|0128|0121|0120|098|097|096|0169|0168|0167|0166|0165|0164|0163|0162|092|0186|0188|0199|099|095)\d{7}$/,
          msg: 'Số điện thoại không đúng định dạng'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatarUrl: DataTypes.STRING,
    isVerifyMobilePhone: DataTypes.BOOLEAN,
    level: DataTypes.INTEGER,
    company: DataTypes.STRING,
    address: DataTypes.STRING,
    district: DataTypes.STRING,
    districtIsUrban: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    noteBySaleman: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  User.hook('beforeCreate', function(user, options, callback) {

    hashPassword(user.password)
      .then(function(hash) {
        user.password = hash;
      })
      .then(function() {
        if (!user.avatarUrl) {
          user.avatarUrl = randomAvatar();
        }
      })
      .finally(function() {
        callback(null, user);
      })
      .catch(function(error) {
        console.log('hashPassword error: ', error);
      });
  });

  return User;
};

function hashPassword(password) {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(error, hash) {
        if (error) {
          reject(error);
        }
        else {
          resolve(hash);
        }

      });
    })
  });
}
