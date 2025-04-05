'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PrescriptionDetail extends Model {
        static associate(models) {

        }
    }
    PrescriptionDetail.init({
        prescriptionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'prescriptions',
                key: 'id',
            },
        },
        medicineId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'medicines',
                key: 'id',
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        dosage: {
            type: DataTypes.STRING(128),
            allowNull: true,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        insuranceCovered: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        coveredPrice: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        session: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        dose: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'PrescriptionDetail',
    });
    return PrescriptionDetail;
};