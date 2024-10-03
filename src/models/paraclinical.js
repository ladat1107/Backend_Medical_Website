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
        }
    }
    Paraclinical.init({
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
        }
    }, {
        sequelize,
        modelName: 'Paraclinical',
    });
    return Paraclinical;
};