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
      Handbook.belongsTo(models.Staff, {
        foreignKey: 'author',
        as: 'handbookStaffData',
      });
    }
  }
  Handbook.init({
    title: DataTypes.STRING,
    tags: DataTypes.STRING,
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'staffs',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    image: DataTypes.STRING,
    status: DataTypes.INTEGER,
    htmlDescription: DataTypes.TEXT,
    shortDescription: DataTypes.STRING,
    view: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {
    sequelize,
    modelName: 'Handbook',
  });
  return Handbook;
};