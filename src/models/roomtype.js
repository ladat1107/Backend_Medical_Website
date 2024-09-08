'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoomType extends Model {
        static associate(models) {
        }
    }
    RoomType.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
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