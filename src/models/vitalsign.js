'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Vitalsign extends Model {
        static associate(models) {
        }
    }
    Vitalsign.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        examinationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'examination', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        height: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        weight: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        fetalWeight: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        pulse: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        temperature: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        hightBloodPressure: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        low_blood_pressure: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        breathing_rate: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        glycemic_index: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'Vitalsign',
    });
    return Vitalsign;
};