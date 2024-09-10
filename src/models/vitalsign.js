'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class VitalSign extends Model {
        static associate(models) {
            VitalSign.belongsTo(models.Examination, {
                foreignKey: 'examinationId',
                as: 'vitalSignExaminationData',
            });
        }
    }
    VitalSign.init({
        examinationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'examinations', // Tên bảng tham chiếu
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

    }, {
        sequelize,
        modelName: 'VitalSign',
    });
    return VitalSign;
};