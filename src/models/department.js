'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Department extends Model {
        static associate(models) {
            Department.hasMany(models.Room, {
                foreignKey: 'medicalExamination',
                as: 'departmentRoomData',
            });
            Department.hasMany(models.Staff, {
                foreignKey: 'departmentId',
                as: 'departmentStaffData',
            });
            Department.hasMany(models.DepartmentSymptom, {
                foreignKey: 'departmentId',
                as: 'departmentDepartmentSymptomData',
            });
            Department.belongsTo(models.Location, {
                foreignKey: 'locationId',
                as: 'departmentLocationData',
            });
            Department.belongsTo(models.Description, {
                foreignKey: 'descriptionId',
                as: 'departmentDescriptionData',
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
        locationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'locations', // Tên bảng locations
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
        }
    }, {
        sequelize,
        modelName: 'Department',
    });
    return Department;
};