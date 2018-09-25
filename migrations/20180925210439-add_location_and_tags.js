'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addColumn(
     'lessons',
     'location',
     {
       type: Sequelize.JSONB,
       allowNull: false
     }
   ).then(() => {
     return queryInterface.addColumn(
       'lessons',
       'tags',
       {
         type: Sequelize.JSONB,
         allowNull: false
       }
     )
   })
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface
    .removeColumn('lessons', 'location')
    .then(() => {
      return queryInterface.removeColumn('lessons', 'tags');
    })
  }
};
