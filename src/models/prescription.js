'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Prescription extends Model {
        static associate(models) {
            Prescription.belongsTo(models.Examination, {
                foreignKey: 'examinationId',
                as: 'prescriptionExamData',
            });
            Prescription.hasMany(models.PrescriptionDetail, {
                foreignKey: 'prescriptionId',
                as: 'prescriptionDetails',
            });
        }
    }
    Prescription.init({
        examinationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'examinations',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        note: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        totalMoney: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Prescription',
    });
    return Prescription;
};