'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
    class DiseaseGroup extends Model {
        static associate(models) {
            // DiseaseGroup.belongsTo(models.Department, {
            //     foreignKey: 'departmentId',
            //     as: 'diseaseGroupDepartmentData',
            // });
            DiseaseGroup.hasMany(models.Disease, {
                foreignKey: 'diseaseGroupId',
                as: 'diseaseGroupDiseaseData',
            });
        }
    }
    DiseaseGroup.init({
        groupName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        groupCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        chapterId: {
            type: DataTypes.INTEGER,
            allowNull: true,
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