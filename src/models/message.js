'use strict';
const {
    Model
} = require('sequelize');
const { STATUS_MESSAGE } = require('../utils');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            Message.belongsTo(models.Conversation, {
                foreignKey: 'conversationId',
                as: 'conversationData',
            });
        }
    }
    Message.init({
        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: DataTypes.TEXT,
        link: DataTypes.STRING(1000),
        status: {
            type: DataTypes.ENUM(STATUS_MESSAGE.FAILED, STATUS_MESSAGE.SENDING, STATUS_MESSAGE.SENT, STATUS_MESSAGE.RECEIVED, STATUS_MESSAGE.READ),
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Message',
    });
    return Message;
};