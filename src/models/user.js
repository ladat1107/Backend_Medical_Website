'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //   User.belongsTo(models.Group, {
      //     foreignKey: 'groupId',
      //     targetKey: 'id',
      //     as: 'userGroup'
      //   });
      //   User.hasMany(models.Project, {
      //     foreignKey: 'customerId',
      //     targetKey: 'id',
      //     as: 'customerData',
      //   });

      //   User.belongsToMany(models.Project, {
      //     through: models.ProjectUser,
      //     uniqueKey: 'userId',
      //     as: "userData",
      //   });
    }
  }
  User.init({
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    cid: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    currentResident: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    avatar: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    folk: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nationality: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ABOBloodGroup: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    RHBloodGroup: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maritalStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    point: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};