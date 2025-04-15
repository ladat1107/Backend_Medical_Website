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
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        inventory: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mfg: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        exp: {
            type: DataTypes.DATE,
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
        insuranceCovered: {
            type: DataTypes.DECIMAL(5, 4),
            allowNull: false,
            defaultValue: 0
        },
        batchNumber: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Medicine',
        indexes: [
            {
                unique: true,
                fields: ['registrationNumber', 'batchNumber']
            }
        ]
    });
    return Medicine;
};