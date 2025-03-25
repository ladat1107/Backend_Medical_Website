'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Conversation extends Model {
        static associate(models) {
            Conversation.hasMany(models.Message, {
                foreignKey: 'conservationId',
                as: 'messageData',
            });
        }
    }
    Conversation.init({
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        staffId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        lastMessage: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'Conversation',
    });
    return Conversation;
};