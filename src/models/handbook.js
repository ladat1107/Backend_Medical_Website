'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Handbook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //   Handbook.belongsTo(models.Group, {
      //     foreignKey: 'groupId',
      //     targetKey: 'id',
      //     as: 'userGroup'
      //   });
      //   Handbook.hasMany(models.Project, {
      //     foreignKey: 'customerId',
      //     targetKey: 'id',
      //     as: 'customerData',
      //   });

      //   Handbook.belongsToMany(models.Project, {
      //     through: models.ProjectUser,
      //     uniqueKey: 'userId',
      //     as: "userData",
      //   });

    }
  }
  Handbook.init({
    title: DataTypes.STRING,
    author: DataTypes.INTEGER,
    image: DataTypes.STRING,
    status: DataTypes.INTEGER,
    descriptionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Handbook',
  });
  return Handbook;
};