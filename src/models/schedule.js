'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        static associate(models) {
        }
    }
    Schedule.init({
        staffId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'staffs', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
        date: {
            type: DataTypes.DATE,
            allowNull: true,
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
        modelName: 'Schedule',
    });
    return Schedule;
};