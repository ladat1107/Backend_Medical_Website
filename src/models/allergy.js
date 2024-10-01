'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allergy extends Model {
        static associate(models) {
            Allergy.hasMany(models.AllergyUser, {
                foreignKey: 'allergyId',
                as: 'allergyUserAllergyData',
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