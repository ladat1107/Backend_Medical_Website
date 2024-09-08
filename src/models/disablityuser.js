'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DisablityUser extends Model {
        static associate(models) {
        }
    }
    DisablityUser.init({
        disabilityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'disability', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        description: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        medicalFacilityRecords: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'DisablityUser',
    });
    return DisablityUser;
};