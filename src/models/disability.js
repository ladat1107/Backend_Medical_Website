'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Disability extends Model {
        static associate(models) {
            Disability.hasMany(models.DisablityUser, {
                foreignKey: 'disabilityId',
                as: 'disabilityDisablityUserData',
            });
        }
    }
    Disability.init({
        bodyPart: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Disability',
    });
    return Disability;
};