'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comorbidities extends Model {
        static associate(models) {
        }
    }
    Comorbidities.init({
        examinationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'examinations', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        diseaseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'diseases', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
       
    }, {
        sequelize,
        modelName: 'Comorbidities',
    });
    return Comorbidities;
};