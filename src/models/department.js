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
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        htmlDescription: DataTypes.TEXT,
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        shortDescription: DataTypes.STRING(2000),
    }, {
        sequelize,
        modelName: 'Department',
    });
    return Department;
};