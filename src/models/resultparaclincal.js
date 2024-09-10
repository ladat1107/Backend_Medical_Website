'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ResultParaclincal extends Model {
        static associate(models) {
            ResultParaclincal.belongsTo(models.Examination, {
                foreignKey: 'examinationId',
                as: 'resultParaclincalExaminationData',
            });
        }
    }
    ResultParaclincal.init({
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
        paraclincal: {
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
       
    }, {
        sequelize,
        modelName: 'ResultParaclincal',
    });
    return ResultParaclincal;
};