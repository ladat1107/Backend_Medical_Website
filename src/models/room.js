'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Room extends Model {
        static associate(models) {
            Room.belongsToMany(models.ServiceType, {
                through: 'RoomServiceTypes',
                foreignKey: 'roomId',
                as: 'serviceData',
            });
            Room.belongsTo(models.Department, {
                foreignKey: 'departmentId',
                as: 'roomDepartmentData',
            });
            Room.belongsTo(models.Specialty, {
                foreignKey: 'medicalExamination',
                as: 'specialtyData',
            });
            Room.belongsToMany(models.Staff, {
                through: 'Schedule',
                foreignKey: 'roomId',
                as: 'roomScheduleData',
            });
            Room.hasMany(models.Bed, {
                foreignKey: 'roomId',
                as: 'bedRoomData',
            });
            Room.hasMany(models.Schedule, {
                foreignKey: 'roomId',
                as: 'scheduleRoomData',
            });
            Room.hasMany(models.Paraclinical, {
                foreignKey: 'roomId',
                as: 'roomParaclinicalData',
            });
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
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'departments', 
                key: 'id',
            },
        },
        medicalExamination: {
            type: DataTypes.INTEGER,
            references: {
                model: 'speciaties', 
                key: 'id',
            },
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    }, {
        sequelize,
        modelName: 'Room',
    });
    return Room;
};