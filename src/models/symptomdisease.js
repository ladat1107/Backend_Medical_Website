'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SymptomDisease extends Model {
        static associate(models) {
            SymptomDisease.belongsTo(models.Symptom, {
                foreignKey: 'symptomId',
                as: 'symptomDiseaseSymptomData',
            });
            SymptomDisease.belongsTo(models.Disease, {
                foreignKey: 'diseaseId',
                as: 'symptomDiseaseDiseaseData',
            });
        }
    }
    SymptomDisease.init({
        symptomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'symptoms', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
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
        modelName: 'SymptomDisease',
    });
    return SymptomDisease;
};