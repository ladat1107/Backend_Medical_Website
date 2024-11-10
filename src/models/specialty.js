'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        static associate(models) {
            Specialty.hasMany(models.Room, {
                foreignKey: 'medicalExamination',
                as: 'roomData',
            });
            Specialty.hasMany(models.Staff, {
                foreignKey: 'specialtyId',
                as: 'staffSpecialtyData',
            });
        }
    }
    Specialty.init({
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Specialty',
    });
    return Specialty;
};