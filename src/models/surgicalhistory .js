'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SurgicalHistory extends Model {
        static associate(models) {
            SurgicalHistory.belongsToMany(models.User, {
                through: 'SurgicalhistoryUsers',
                foreignKey: 'surgicalhistoryId',
                as: 'userData',
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
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'SurgicalHistory',
    });
    return SurgicalHistory;
};