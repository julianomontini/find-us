'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LessonCandidates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      lessonId: {
        type: Sequelize.BIGINT,
        references: {model: 'lessons'},
        allowNull: false
      },
      teacherId: {
        type: Sequelize.BIGINT,
        references: {model: 'customers'},
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'declined'),
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
    return queryInterface.dropTable('LessonCandidates');
  }
};