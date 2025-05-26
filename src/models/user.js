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
      User.hasOne(models.Insurance, {
        foreignKey: 'userId',
        as: 'userInsuranceData', // Phải đồng nhất với alias khi truy vấn
      });
      User.hasMany(models.Staff, {
        foreignKey: 'userId',
        as: 'staffUserData',
      });
      User.hasMany(models.Relative, {
        foreignKey: 'userId',
        as: 'userRelativeData',
      });
      User.hasOne(models.Conversation, {
        foreignKey: 'patientId',
        as: 'patientData',
      })
      User.hasMany(models.Conversation, {
        foreignKey: 'staffId',
        as: 'staffData',
      })
      User.hasMany(models.Examination, {
        foreignKey: 'userId',
        as: 'userExaminationData',
      });
      User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'userRoleData',
      });
      User.belongsTo(models.Folk, {
        foreignKey: 'folk',
        as: 'folkData',
      });
    }
  }
  User.init({
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
      allowNull: true,
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
    gender: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    avatar: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "https://md.surehis.com/File/Lawyer_LawOffice/avatar%20bs%20covid_02.png"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    folk: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'folks', // Tên bảng tham chiếu
        key: 'id',
      },
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
    tokenVersion: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    googleId: DataTypes.STRING(255),
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