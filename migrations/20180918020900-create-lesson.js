'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Lessons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.INTEGER,
        references: {model: 'customers', key: 'id'},
        allowNull: false
      },
      teacherId: {
        type: Sequelize.INTEGER,
        references: {model: 'customers', key: 'id'},
        allowNull: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      price: {
        type: Sequelize.NUMERIC
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Lessons');
  }
};