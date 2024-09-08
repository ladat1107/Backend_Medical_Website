'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SurgicalhistoryUser extends Model {
        static associate(models) {
        }
    }
    SurgicalhistoryUser.init({
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
        surgicalhistoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'surgicalhistory', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        implementationDate: {
            type: DataTypes.DATE,
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
        modelName: 'SurgicalhistoryUser',
    });
    return SurgicalhistoryUser;
};