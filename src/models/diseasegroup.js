'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DiseaseGroup extends Model {
        static associate(models) {
            DiseaseGroup.belongsTo(models.Department, {
                foreignKey: 'departmentId',
                as: 'diseaseGroupDepartmentData',
            });
            DiseaseGroup.hasMany(models.Disease, {
                foreignKey: 'diseaseGroupId',
                as: 'diseaseGroupDiseaseData',
            });
        }
    }
    DiseaseGroup.init({
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'departments', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
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
        modelName: 'DiseaseGroup',
    });
    return DiseaseGroup;
};