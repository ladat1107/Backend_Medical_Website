'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AdvanceMoney extends Model {
        static associate(models) {
            AdvanceMoney.belongsTo(models.Examination, {
                foreignKey: 'exam_id',
                as: 'AdvanceMoneyExaminationData',
            });
            AdvanceMoney.belongsTo(models.Payment, {
                foreignKey: 'paymentId',
                as: 'advanceMoneyData',
            });
        }
    }
    AdvanceMoney.init({
        exam_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'AdvanceMoney',
    });
    return AdvanceMoney;
};