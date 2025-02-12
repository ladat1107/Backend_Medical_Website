'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Folk extends Model {
        static associate(models) {
            Folk.hasMany(models.User, {
                foreignKey: 'folk',
                as: 'userData',
            });
        }
    }
    Folk.init({
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Folk',
    });
    return Folk;
};