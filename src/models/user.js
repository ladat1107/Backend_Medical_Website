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
      User.hasOne(models.ConditionAtBirth, {
        foreignKey: 'userId',
        as: 'conditionAtBirthUserData',
      });
      User.hasMany(models.Staff, {
        foreignKey: 'userId',
        as: 'staffUserData',
      });
      User.hasMany(models.Patient, {
        foreignKey: 'userId',
        as: 'patientUserData',
      });
      User.hasMany(models.Relative, {
        foreignKey: 'userId',
        as: 'userRelativeData',
      });
      User.hasMany(models.FamilyHistory, {
        foreignKey: 'userId',
        as: 'userFamilyHistoryData',
      });
      User.belongsToMany(models.SurgicalHistory, {
        through: 'SurgicalhistoryUsers',
        foreignKey: 'userId',
        as: 'surgicalhistoryData',
      });
      User.belongsToMany(models.Disability, {
        through: 'DisabilityUsers',
        foreignKey: 'userId',
        as: 'disablityData',
      });
      User.belongsToMany(models.Allergy, {
        through: 'AllergyUsers',
        foreignKey: 'userId',
        as: 'allergyData',
      });
      User.belongsToMany(models.Disease, {
        through: 'DiseaseUsers',
        foreignKey: 'userId',
        as: 'diseaseData',
      });
      User.hasMany(models.Appointment, {
        foreignKey: 'userId',
        as: 'appointmentUserData',
      });
      User.hasMany(models.Examination, {
        foreignKey: 'userId',
        as: 'userExaminationData',
      });
      User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'userRoleData',
      });
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
    gender: {
      type: DataTypes.INTEGER,
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