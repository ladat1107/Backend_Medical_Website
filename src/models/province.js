'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Province extends Model {
        static associate(models) {
            // Province.hasMany(models.User, {
            //     foreignKey: 'province',
            //     as: 'userData',
            // });
        }
    }
    Province.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        nameVi: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        nameEn: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 7), // Lưu kinh độ
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 7), // Lưu vĩ độ
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Province',
    });
    return Province;
};