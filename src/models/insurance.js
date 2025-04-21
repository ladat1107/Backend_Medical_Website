'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Insurance extends Model {
        static associate(models) {
            Insurance.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'insuranceUserData', // Phải đồng nhất với alias khi truy vấn
            });
        }
    }
    Insurance.init({
        insuranceCode: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        dateOfIssue: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        exp: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        benefitLevel: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        residentialCode: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        initialHealthcareRegistrationCode: {
            type: DataTypes.STRING(1000),
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