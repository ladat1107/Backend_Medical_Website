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
            primaryKey: true,
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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