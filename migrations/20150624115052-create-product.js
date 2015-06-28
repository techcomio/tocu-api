'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Products', {
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
      description: {
        type: Sequelize.TEXT
      },
      BoxId: {
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM,
        values: ['Draft', 'Available', 'Suspended', 'Sold', 'Closed'],
        defaultValue: 'Available'
      },
      price: {
        type: Sequelize.INTEGER
      },
      salePrice: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ModelId: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Products');
  }
};
