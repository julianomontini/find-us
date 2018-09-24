'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CustomerRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {model: 'customers', key: 'id'},
        allowNull: false
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {model: 'roles', key: 'id'},
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'blocked', 'inactive'),
        allowNull: false
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CustomerRoles');
  }
};