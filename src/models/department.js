'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Department extends Model {
        static associate(models) {
        }
    }
    Department.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
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
                model: 'staff', // Tên bảng staff
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updateAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        locationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'location', // Tên bảng location
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