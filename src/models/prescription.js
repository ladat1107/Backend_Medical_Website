'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Prescription extends Model {
        static associate(models) {
            Prescription.belongsTo(models.Examination, {
                foreignKey: 'examId',
                as: 'prescriptionExamData',
            });
            Prescription.belongsTo(models.Medicine, {
                foreignKey: 'medicineId',
                as: 'prescriptionMedicineData',
            });
        }
    }
    Prescription.init({
        examId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'examinations', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        medicineId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'medicines', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dosage: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Prescription',
    });
    return Prescription;
};