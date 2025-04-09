'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Medicine extends Model {
        static associate(models) {
            Medicine.belongsToMany(models.Prescription, {
                through: 'PrescriptionDetail',
                foreignKey: 'medicineId',
                as: 'prescriptionData',
            });
        }
    }
    Medicine.init({
        name: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        registrationNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        inventory: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        exp: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        approvalNumber: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        approvalDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        dosageForm: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        manufacturerCountry: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        activeIngredient: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        group: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        concentration: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        isCovered: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
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