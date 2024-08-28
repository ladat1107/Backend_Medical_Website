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
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    image: DataTypes.TEXT('long'),
    groupId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};