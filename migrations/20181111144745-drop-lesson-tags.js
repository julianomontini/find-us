'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Lessons',
      'Tags'
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Lessons',
      'Tags',
      Sequelize.JSONB
    );
  }
};
