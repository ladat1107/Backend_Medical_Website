'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allgergy extends Model {
        static associate(models) {
            Allgergy.hasMany(models.AllergyUser, {
                foreignKey: 'allergyId',
                as: 'allgergyAllergyUserData',
            });
        }
    }
    Allgergy.init({
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        agent: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        diseaseManifestation: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Allgergy',
    });
    return Allgergy;
};