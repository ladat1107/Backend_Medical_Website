'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Disability extends Model {
        static associate(models) {
            Disability.hasMany(models.DisabilityUser, {
                foreignKey: 'disabilityId',
                as: 'disablityUserDisabilityData',
            });
        }
    }
    Disability.init({
        bodyPart: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Disability',
    });
    return Disability;
};