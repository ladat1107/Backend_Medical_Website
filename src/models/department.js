'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Department extends Model {
        static associate(models) {
            Department.hasMany(models.Room, {
                foreignKey: 'departmentId',
                as: 'roomData',
            });
            Department.hasMany(models.Staff, {
                foreignKey: 'departmentId',
                as: 'staffDepartmentData',
            });
            Department.belongsToMany(models.Symptom, {
                through: 'DepartmentSymptoms',
                foreignKey: 'id',
                as: 'symptomData',
            });
            Department.belongsTo(models.Description, {
                foreignKey: 'descriptionId',
                as: 'departmentDescriptionData',
            });
            Department.belongsTo(models.Staff, {
                foreignKey: 'deanId',
                as: 'deanDepartmentData',
            });
        }
    }
    Department.init({
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        deanId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Staffs', // Tên bảng staffs
                key: 'id',
            },
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        descriptionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Descriptions', // Tên bảng descriptions
                key: 'id',
            },
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Department',
    });
    return Department;
};