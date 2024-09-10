'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Insurance extends Model {
        static associate(models) {
            Insurance.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'insuranceUserData',
            });
        }
    }
    Insurance.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        insuanceCode: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        dateOfIssue: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        exp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        benefitLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        residentialCode: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        initialHealthcareRegistrationCode: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        continuousFiveYearPeriod: {
            type: DataTypes.DATE,
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
        modelName: 'Insurance',
    });
    return Insurance;
};