'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING
  }, {timestamps: true});
  Role.associate = function(models) {
    // associations can be defined here
    Role.belongsToMany(models.Customer, {as: 'Customers', through: 'CustomerRole'})
  };
  return Role;
};