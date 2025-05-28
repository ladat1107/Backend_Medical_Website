'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Disease extends Model {
        static associate(models) {
            Disease.belongsTo(models.DiseaseGroup, {
                foreignKey: 'diseaseGroupId',
                as: 'diseaseDiseaseGroupData',
            }); 
        }
    }
    Disease.init({
        code: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        diseaseGroupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'diseasegroups', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    }, {
        sequelize,
        modelName: 'Disease',
    });
    return Disease;
};