'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomerRole = sequelize.define('CustomerRole', {
    customerId: DataTypes.BIGINT,
    roleId: DataTypes.BIGINT,
    status: {
      type: DataTypes.ENUM,
      values: ['active', 'blocked', 'inactive'] ,
      defaultValue: 'active'
    }
  }, {timestamps: true});
  CustomerRole.associate = function(models) {
    // associations can be defined here
  };
  return CustomerRole;
};