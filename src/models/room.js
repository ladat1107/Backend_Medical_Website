'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Room extends Model {
        static associate(models) {
            Room.belongsTo(models.RoomType, {
                foreignKey: 'typeRoom',
                as: 'roomRoomTypeData',
            });
            Room.belongsTo(models.Department, {
                foreignKey: 'departmentId',
                as: 'roomDepartmentData',
            });
            Room.belongsTo(models.Department, {
                foreignKey: 'medicalExamination',
                as: 'medicalExaminationDepartmentData',
            });
            Room.hasMany(models.Schedule, {
                foreignKey: 'roomId',
                as: 'roomScheduleData',
            });
            Room.hasMany(models.Bed, {
                as: 'bedRoomData',
            });
        }
    }
    Room.init({
        name: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        typeRoom: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'roomtypes', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'departments', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        medicalExamination: {
            type: DataTypes.INTEGER,
            references: {
                model: 'departments', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
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
        modelName: 'Room',
    });
    return Room;
};