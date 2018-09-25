'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Ratings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fromCustomerId: {
        type: Sequelize.INTEGER,
        references: {model: 'Customers'},
        allowNull: false
      },
      toCustomerId: {
        type: Sequelize.INTEGER,
        references: {model: 'Customers'},
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lessonId: {
        type: Sequelize.INTEGER,
        references: {model: 'Lessons'},
        allowNull: false
      },
      value: {
        type: Sequelize.NUMERIC
      },
      comment: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
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
    return queryInterface.dropTable('Ratings');
  }
};