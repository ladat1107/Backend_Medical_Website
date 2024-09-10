'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SurgicalHistory extends Model {
        static associate(models) {
            SurgicalHistory.hasMany(models.SurgicalhistoryUser, {
                foreignKey: 'surgicalhistoryId',
                as: 'surgicalhistoryUserData',
            });
        }
    }
    SurgicalHistory.init({
        diseaseName: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        bodyPart: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
      
    }, {
        sequelize,
        modelName: 'SurgicalHistory',
    });
    return SurgicalHistory;
};