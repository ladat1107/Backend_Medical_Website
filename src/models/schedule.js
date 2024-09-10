'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        static associate(models) {
            Schedule.belongsTo(models.Staff, {
                foreignKey: 'staffId',
                as: 'scheduleStaffData',
            });
            Schedule.belongsTo(models.Room, {
                foreignKey: 'roomId',
                as: 'schduleRoomData',
            });
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
        
    }, {
        sequelize,
        modelName: 'Schedule',
    });
    return Schedule;
};