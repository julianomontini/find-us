'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        notEmpty: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true,
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
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
    return queryInterface.dropTable('Customers');
  }
};