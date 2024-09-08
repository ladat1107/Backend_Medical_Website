'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
        }
    }
    Role.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
       
    }, {
        sequelize,
        modelName: 'Role',
    });
    return Role;
};