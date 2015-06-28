'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mobilePhone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avatarUrl: {
        type: Sequelize.STRING
      },
      isVerifyMobilePhone: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      point: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      coin: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      company: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      districtIsUrban: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      city: {
        type: Sequelize.STRING
      },
      createdBy: {
        type: Sequelize.JSON
      },
      updatedBy: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};
