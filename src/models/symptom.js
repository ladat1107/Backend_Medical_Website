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
      //   Symptom.belongsTo(models.Group, {
      //     foreignKey: 'groupId',
      //     targetKey: 'id',
      //     as: 'userGroup'
      //   });
      //   Symptom.hasMany(models.Project, {
      //     foreignKey: 'customerId',
      //     targetKey: 'id',
      //     as: 'customerData',
      //   });

      //   Symptom.belongsToMany(models.Project, {
      //     through: models.ProjectUser,
      //     uniqueKey: 'userId',
      //     as: "userData",
      //   });

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