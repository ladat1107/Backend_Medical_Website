'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ServiceType extends Model {
        static associate(models) {
            ServiceType.belongsToMany(models.Room, {
                through: 'RoomServiceTypes',
                foreignKey: 'serviceId',
                as: 'roomData',
            });
            ServiceType.hasMany(models.Paraclinical, {
                foreignKey: 'paraclinical',
                as: 'paraclinicalData',
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
        isLaboratory: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        sequelize,
        modelName: 'ServiceType',
    });
    return ServiceType;
};