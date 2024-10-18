'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Paraclinical extends Model {
        static associate(models) {
            Paraclinical.belongsTo(models.Examination, {
                foreignKey: 'examinationId',
                as: 'examinationResultParaclincalData',
            });
            Paraclinical.belongsTo(models.Staff, {
                foreignKey: 'doctorId',
                as: 'doctorParaclinicalData',
            });
        }
    }
    Paraclinical.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        examinationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'examinations', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        paraclinical: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        result: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price :{
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        doctorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'staffs', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    }, {
        sequelize,
        modelName: 'Paraclinical',
    });
    return Paraclinical;
};