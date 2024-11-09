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
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
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
                as: 'bedRoomData',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        }
    }
    Room.init({
        name: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'departments', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
        },
        medicalExamination: {
            type: DataTypes.INTEGER,
            references: {
                model: 'speciaties', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
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