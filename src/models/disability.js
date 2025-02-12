'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Disability extends Model {
        static associate(models) {
            Disability.belongsToMany(models.User, {
                through: 'DisabilityUsers',
                foreignKey: 'disabilityId',
                as: 'userData',
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