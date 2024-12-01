'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        static associate(models) {
            Schedule.belongsTo(models.Staff, {
                foreignKey: 'staffId',
                as: 'staffScheduleData',
            });
            Schedule.belongsTo(models.Room, {
                foreignKey: 'roomId',
                as: 'scheduleRoomData',
            });
        }
    }
    Schedule.init({
        staffId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'staffs',
                key: 'id',
            },
            primaryKey: true,
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rooms', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            primaryKey: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            primaryKey: true,
        },

    }, {
        sequelize,
        modelName: 'Schedule',
    });
    return Schedule;
};