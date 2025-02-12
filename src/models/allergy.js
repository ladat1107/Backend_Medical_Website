'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allergy extends Model {
        static associate(models) {
            Allergy.belongsToMany(models.User, {
                through: 'AllergyUsers',
                foreignKey: 'allergyId',
                as: 'userData',
            });
        }
    }
    Allergy.init({
        agent: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        diseaseManifestation: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Allergy',
    });
    return Allergy;
};