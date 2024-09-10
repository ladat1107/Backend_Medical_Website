'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FamilyHistory extends Model {
        static associate(models) {
            FamilyHistory.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'userFamilyHistoryData',
            });
        }
    }
    FamilyHistory.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        relationship: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        diseaseGroup: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        disease_name: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        discoveryDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        illnessDuration: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        medicalFacilityRecords: {
            type: DataTypes.STRING(45),
            allowNull: true,
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
        },
       
    }, {
        sequelize,
        modelName: 'FamilyHistory',
    });
    return FamilyHistory;
};