'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoomType extends Model {
        static associate(models) {
            RoomType.hasMany(models.Room, {
                foreignKey: 'roomTypeId',
                as: 'roomTypeRoomData',
            });
        }
    }
    RoomType.init({
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
        modelName: 'RoomType',
    });
    return RoomType;
};