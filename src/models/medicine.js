'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Medicine extends Model {
        static associate(models) {
            Medicine.hasMany(models.Prescription, {
                foreignKey: 'medicineId',
                as: 'medicinePrescriptionData',
            });
        }
    }
    Medicine.init({
        name: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        unitPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        unit: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        inventory: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        exp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Medicine',
    });
    return Medicine;
};