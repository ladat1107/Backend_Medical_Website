'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DiseaseUser extends Model {
        static associate(models) {
            // DiseaseUser.belongsTo(models.User, {
            //     foreignKey: 'userId',
            //     as: 'diseaseUserUserData',
            // });
            // DiseaseUser.belongsTo(models.Disease, {
            //     foreignKey: 'diseaseId',
            //     as: 'diseaseUserDiseaseData',
            // });
        }
    }
    DiseaseUser.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
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
        illnessDuration: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        discoveryDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        medicalFacilityRecords: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },

    }, {
        sequelize,
        modelName: 'DiseaseUser',
    });
    return DiseaseUser;
};