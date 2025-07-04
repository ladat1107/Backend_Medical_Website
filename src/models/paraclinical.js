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
            Paraclinical.belongsTo(models.Room, {
                foreignKey: 'roomId',
                as: 'roomParaclinicalData',
            });
            Paraclinical.belongsTo(models.ServiceType, {
                foreignKey: 'paraclinical',
                as: 'paraclinicalData',
            });
            Paraclinical.belongsTo(models.Payment, {
                foreignKey: 'paymentId',
                as: 'paymentData',
            });
        }
    }
    Paraclinical.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        examinationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'examinations', // Tên bảng tham chiếu
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        paraclinical: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'servicetypes', // Tên bảng tham chiếu
                key: 'id',
            }
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
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'rooms', // T
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        paracName: {
            type: DataTypes.STRING(512),
            allowNull: true,
        },
        paymentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'payments', // Tên bảng tham chiếu
                key: 'id',
            },
        },
    }, {
        sequelize,
        modelName: 'Paraclinical',
    });
    return Paraclinical;
};