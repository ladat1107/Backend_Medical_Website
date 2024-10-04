'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PrescriptionDetail extends Model {
        static associate(models) {
            PrescriptionDetail.belongsTo(models.Medicine, {
                foreignKey: 'medicineId',
                as: 'prescriptionDetailMedicineData',
            });
            PrescriptionDetail.belongsTo(models.Prescription, {
                foreignKey: 'prescriptionId',
                as: 'prescriptionDetails',
            });
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
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        medicineId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'medicines',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'PrescriptionDetail',
    });
    return PrescriptionDetail;
};