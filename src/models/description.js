'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Description extends Model {
    static associate(models) {
      Description.hasMany(models.Department, {
        foreignKey: 'descriptionId',
        as: 'departmentDescriptionData',
      });
      Description.hasMany(models.Staff, {
        foreignKey: 'descriptionId',
        as: 'staffDescriptionData',
      });
      Description.hasMany(models.Handbook, {
        foreignKey: 'descriptionId',
        as: 'handbookDescriptionData',
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