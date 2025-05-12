'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InpatientRoom extends Model {
        static associate(models) {
            InpatientRoom.belongsTo(models.Examination, {
                foreignKey: 'examId',
                as: 'inpatientRoomExaminationData',
            });
            InpatientRoom.belongsTo(models.Room, {
                foreignKey: 'roomId',
                as: 'inpatientRoomRoomData', 
            });
        }
    }
    InpatientRoom.init({
        examId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        roomName: {
            type: DataTypes.STRING(256),
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'InpatientRoom',
    });
    return InpatientRoom;
};