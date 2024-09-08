'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bed extends Model {
        static associate(models) {
        }
    }
    Bed.init({
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
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rooms', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    }, {
        sequelize,
        modelName: 'Bed',
    });
    return Bed;
};