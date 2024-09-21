'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bed extends Model {
        static associate(models) {
            Bed.hasMany(models.Patient, {
                as: 'bedPatientData',
                foreignKey: 'bedId',
            });
            Bed.belongsTo(models.Room, {
                foreignKey: 'roomId',
                as: 'bedRoomData',
            });
        }
    }
    Bed.init({
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