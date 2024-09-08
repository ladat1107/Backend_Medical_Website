'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Disability extends Model {
        static associate(models) {
        }
    }
    Disability.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        bodyPart: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Disability',
    });
    return Disability;
};