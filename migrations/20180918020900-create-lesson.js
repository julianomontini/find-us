'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Lessons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      studentId: {
        type: Sequelize.BIGINT,
        references: {model: 'customers', key: 'id'},
        allowNull: false
      },
      teacherId: {
        type: Sequelize.BIGINT,
        references: {model: 'customers', key: 'id'},
        allowNull: false
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
      location: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      price: {
        type: Sequelize.NUMERIC
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
    return queryInterface.dropTable('Lessons');
  }
};