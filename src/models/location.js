'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Location.hasMany(models.Department, {
        foreignKey: 'locationId',
        as: 'locationDepartmentData',
      });
      Location.hasMany(models.Room, {
        foreignKey: 'locationId',
        as: 'locationRoomData',
      });
    }
  }
  Location.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    floor: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};