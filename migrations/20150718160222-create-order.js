'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      store: {
        type: Sequelize.ENUM,
        values: ['Online', 'Hoàng Quốc Việt', 'Minh Khai'],
        allowNull: false
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      shippingInfo: {
        type: Sequelize.JSONB
      },
      shippingMethod: {
        type: Sequelize.ENUM,
        values: ['at store', 'COD', 'delivery']
      },
      paymentMethod: {
        type: Sequelize.ENUM,
        values: ['cash', 'card', 'transfer']
      },
      status: {
        type: Sequelize.ENUM,
        values: ['open', 'processing', 'pending', 'partial paid', 'paid', 'sending', 'completed', 'failed', 'canceled'],
        defaultValue: 'open'
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      percentageDiscount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      fixedDiscount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalWeight: {
        type: Sequelize.INTEGER
      },
      noteBySaleman: {
        type: Sequelize.TEXT
      },
      createdBy: {
        type: Sequelize.JSONB
      },
      updatedBy: {
        type: Sequelize.JSONB
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
    return queryInterface.dropTable('Orders');
  }
};