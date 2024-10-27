'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        static associate(models) {
            Appointment.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'appointmentUserData',
            });
            Appointment.belongsTo(models.Staff, {
                foreignKey: 'staffId',
                as: 'appointmentStaffData',
            });
            Appointment.belongsTo(models.Examination, {
                foreignKey: 'examinationId',
                as: 'appointmentExaminationData',
            });
        }
    }
    Appointment.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
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
            primaryKey: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            primaryKey: true,
        },
        time: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        symptom: {
            type: DataTypes.STRING,
        },
        specialNote: {
            type: DataTypes.STRING,
        },
        examinationId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'examinations', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    }, {
        sequelize,
        modelName: 'Appointment',
    });
    return Appointment;
};