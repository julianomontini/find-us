'use strict';
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    cpf: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {timestamps: true});
  Customer.associate = function(models) {
    Customer.belongsToMany(models.Role, {as: 'Roles', through: 'CustomerRole'});
    Customer.belongsToMany(models.Lesson, {as: 'CandidatedLessons', through: 'LessonCandidate', foreignKey: 'teacherId'});
    Customer.hasOne(models.CustomerConfiguration, {as: 'Configuration', foreignKey: 'customerId'});
  };
  return Customer;
};