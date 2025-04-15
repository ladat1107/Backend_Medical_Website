'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            Notification.hasMany(models.AttachFile, {
                foreignKey: 'notiCode',
                sourceKey: 'notiCode', // Specify sourceKey to match the foreign key
                as: 'NotificationAttachFileData',
            });
            Notification.belongsTo(models.User, {
                foreignKey: 'senderId',
                as: 'NotificationSenderData',
            })
        }
    }
    Notification.init({
        title: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        htmlDescription: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        notiCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Notification',
    });
    return Notification;
};