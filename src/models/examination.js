'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Examination extends Model {
        static associate(models) {
            Examination.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'examinationUserData',
            });
            Examination.belongsTo(models.Staff, {
                foreignKey: 'staffId',
                as: 'examinationStaffData',
            });
            Examination.hasMany(models.ResultParaclincal, {
                foreignKey: 'examinationId',
                as: 'examinationResultParaclincalData',
            });
            Examination.hasOne(models.VitalSign, {
                foreignKey: 'examinationId',
                as: 'examinationVitalSignData',
            });
            Examination.hasMany(models.Prescription, {
                foreignKey: 'examinationId',
                as: 'examinationPrescriptionData',
            });
            Examination.hasMany(models.Comorbidities, {
                foreignKey: 'examinationId',
                as: 'examinationComorbiditiesData',
            });
        }
    }
    Examination.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        staffId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'staffs', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        symptom: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        diseaseName: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        treatmentResult: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        admissionDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        dischargeDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        medicalTreatmentTier: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        paymentDoctorStatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        special: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'Examination',
    });
    return Examination;
};