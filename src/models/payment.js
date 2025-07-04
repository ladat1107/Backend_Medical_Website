'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            Payment.hasOne(models.Examination, {
                foreignKey: 'paymentId',
                as: 'examinationData',
            });
            Payment.hasMany(models.Paraclinical, {
                foreignKey: 'paymentId',
                as: 'paraclinicalData',
            });
            Payment.hasOne(models.Prescription, {
                foreignKey: 'paymentId',
                as: 'prescriptionData',
            });
            Payment.hasOne(models.AdvanceMoney, {
                foreignKey: 'paymentId',
                as: 'advanceMoneyData',
            });
        }
    }
    Payment.init({
        orderId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        transId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        paymentMethod: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        detail: DataTypes.TEXT,
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    }, {
        sequelize,
        modelName: 'Payment',
    });
    return Payment;
};