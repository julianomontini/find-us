'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomerConfiguration = sequelize.define('CustomerConfiguration', {
    location: DataTypes.JSONB,
    tags: DataTypes.JSONB
  }, {});
  CustomerConfiguration.associate = function(models) {
    CustomerConfiguration.belongsTo(models.Customer)
  };
  return CustomerConfiguration;
};