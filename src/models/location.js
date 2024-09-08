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
      //   Location.belongsTo(models.Group, {
      //     foreignKey: 'groupId',
      //     targetKey: 'id',
      //     as: 'userGroup'
      //   });
      //   Location.hasMany(models.Project, {
      //     foreignKey: 'customerId',
      //     targetKey: 'id',
      //     as: 'customerData',
      //   });

      //   Location.belongsToMany(models.Project, {
      //     through: models.ProjectUser,
      //     uniqueKey: 'userId',
      //     as: "userData",
      //   });

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