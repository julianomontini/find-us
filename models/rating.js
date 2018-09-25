'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    value: DataTypes.NUMERIC,
    comment: DataTypes.STRING,
    fromCustomerId: DataTypes.INTEGER,
    toCustomerId: DataTypes.INTEGER,
    role: DataTypes.STRING,
    lessonId: DataTypes.INTEGER
  }, {});
  Rating.associate = function(models) {
    Rating.belongsTo(models.Customer, {as: 'FromCustomer', foreignKey: 'fromCustomerId'});
    Rating.belongsTo(models.Customer, {as: 'ToCustomer', foreignKey: 'toCustomerId'});
    Rating.belongsTo(models.Lesson);
  };
  return Rating;
};