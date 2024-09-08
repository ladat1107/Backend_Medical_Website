'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Surgicalhistory extends Model {
        static associate(models) {
        }
    }
    Surgicalhistory.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        diseaseName: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        bodyPart: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
      
    }, {
        sequelize,
        modelName: 'Surgicalhistory',
    });
    return Surgicalhistory;
};