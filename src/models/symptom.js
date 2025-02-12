'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Symptom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Symptom.belongsToMany(models.Department, {
        through: 'DepartmentSymptoms',
        foreignKey: 'symptomId',
        as: 'departmentData',
      });
    }
  }
  Symptom.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Symptom',
  });
  return Symptom;
};