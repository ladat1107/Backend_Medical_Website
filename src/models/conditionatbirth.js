'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ConditionAtBirth extends Model {
        static associate(models) {
        }
    }
    ConditionAtBirth.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
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
        },
        typeOfBirth: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        weight: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        height: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        detail: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
       
    }, {
        sequelize,
        modelName: 'ConditionAtBirth',
    });
    return ConditionAtBirth;
};