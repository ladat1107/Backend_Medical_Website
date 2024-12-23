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
            Prescription.belongsToMany(models.Medicine, {
                through: 'PrescriptionDetail',
                foreignKey: 'prescriptionId',
                as: 'prescriptionDetails',
            });
            Prescription.belongsTo(models.Payment, {
                foreignKey: 'paymentId',
                as: 'paymentData',
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
        },
        note: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        totalMoney: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER, // 0 - delete, 1 - unpay, 2 - paid
            allowNull: false,
        },
        paymentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'payments', // Tên bảng tham chiếu
                key: 'id',
            },
        },
    }, {
        sequelize,
        modelName: 'Prescription',
    });
    return Prescription;
};