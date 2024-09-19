'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Department extends Model {
        static associate(models) {
            Department.hasMany(models.Room, {
                foreignKey: 'id',
                as: 'roomDepartmentData',
            });
            Department.hasMany(models.Room, {
                foreignKey: 'id',
                as: 'medicalExaminationDepartmentData',
            });
            Department.hasMany(models.Staff, {
                foreignKey: 'id',
                as: 'staffDepartmentData',
            });
            Department.hasMany(models.DepartmentSymptom, {
                foreignKey: 'id',
                as: 'departmentDepartmentSymptomData',
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
                model: 'staffs', // Tên bảng staffs
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        descriptionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'descriptions', // Tên bảng descriptions
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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