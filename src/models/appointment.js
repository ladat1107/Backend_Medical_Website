'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        static associate(models) {
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
                model: 'staff', // Tên bảng tham chiếu
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
            primaryKey: true,
        },
        createAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updateAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'Appointment ',
    });
    return Appointment;
};