'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoomServiceType extends Model {
        static associate(models) {
            RoomServiceType.belongsTo(models.Room, {
                foreignKey: 'roomId',
                as: 'serviceData',
            });
            RoomServiceType.belongsTo(models.ServiceType, {
                foreignKey: 'serviceId',
                as: 'roomData',
            });
        }
    }
    RoomServiceType.init({
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rooms', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        serviceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'servicetypes', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
    }, {
        sequelize,
        modelName: 'RoomServiceType',
    });
    return RoomServiceType;
};