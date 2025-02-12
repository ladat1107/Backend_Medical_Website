'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            Role.hasMany(models.User, {
                foreignKey: 'roleId',
                as: 'userRoleData',
            });
        }
    }
    Role.init({
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Role',
    });
    return Role;
};