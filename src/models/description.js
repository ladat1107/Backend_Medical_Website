'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Description extends Model {
    static associate(models) {
      Description.hasMany(models.Department, {
        foreignKey: 'descriptionId',
        as: 'descriptionDepartmentData',
      });
      Description.hasMany(models.Staff, {
        foreignKey: 'descriptionId',
        as: 'descriptionStaffData',
      });
      Description.hasMany(models.Handbook, {
        foreignKey: 'descriptionId',
        as: 'descriptionHandbookData',
      });
    }
  }
  Description.init({
    markDownContent: DataTypes.TEXT,
    htmlContent: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Description',
  });
  return Description;
};