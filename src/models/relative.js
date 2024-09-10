'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Relative extends Model {
        static associate(models) {
            Relative.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'relativeUserData',
            });
        }
    }
    Relative.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        cid: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        relationship: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(512),
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Tên bảng tham chiếu (users)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },

    }, {
        sequelize,
        modelName: 'Relative',
    });
    return Relative;
};