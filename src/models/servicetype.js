'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ServiceType extends Model {
        static associate(models) {
            ServiceType.hasMany(models.RoomServiceType, {
                foreignKey: 'serviceId',
                as: 'roomData',
            });
        }
    }
    ServiceType.init({
        name: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

    }, {
        sequelize,
        modelName: 'ServiceType',
    });
    return ServiceType;
};