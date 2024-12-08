'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class District extends Model {
        static associate(models) {
            // District.hasMany(models.User, {
            //     foreignKey: 'district',
            //     as: 'userData',
            // });
        }
    }
    District.init({
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
        modelName: 'District',
    });
    return District;
};