'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ticket extends Model {
        static associate(models) {

        }
    }
    Ticket.init({
        normalNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        priorityNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        normalNumberCurrent: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        priorityNumberCurrent: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Ticket',
    });
    return Ticket;
};