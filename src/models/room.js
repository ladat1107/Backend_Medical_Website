'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Room extends Model {
        static associate(models) {
        }
    }
    Room.init({
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
        typeRoom: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'roomtype', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        locationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'location', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        medicalExamination: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'department', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updateAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        }
    }, {
        sequelize,
        modelName: 'Room',
    });
    return Room;
};