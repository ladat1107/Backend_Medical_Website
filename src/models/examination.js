'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Examination extends Model {
        static associate(models) {
            Examination.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'userExaminationData',
            });
            Examination.belongsTo(models.Staff, {
                foreignKey: 'staffId',
                as: 'examinationStaffData',
            });
            Examination.hasMany(models.Paraclinical, {
                foreignKey: 'examinationId',
                as: 'examinationResultParaclincalData',
            });
            Examination.hasOne(models.VitalSign, {
                foreignKey: 'examinationId',
                as: 'examinationVitalSignData',
            });
            Examination.hasMany(models.Prescription, {
                foreignKey: 'examinationId',
                as: 'prescriptionExamData',
            });
            Examination.hasMany(models.Comorbidities, {
                foreignKey: 'examinationId',
                as: 'examinationComorbiditiesData',
            });
            Examination.belongsTo(models.Payment, {
                foreignKey: 'paymentId',
                as: 'paymentData',
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
        },
        symptom: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        diseaseName: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        treatmentResult: {
            type: DataTypes.STRING(256),
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
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        medicalTreatmentTier: {
            type: DataTypes.INTEGER,
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
        special: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        insuranceCoverage: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        comorbidities: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        roomName: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        time: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        visit_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_appointment: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        insuranceCode: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        bookFor: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'users', // Tên bảng tham chiếu
                key: 'id',
            },
        },
        paymentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'payments', // Tên bảng tham chiếu
                key: 'id',
            },
        },
        oldParaclinical: DataTypes.TEXT,
        reExaminationDate: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Examination',
    });
    return Examination;
};