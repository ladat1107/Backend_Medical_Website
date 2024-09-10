'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DisablityUser extends Model {
        static associate(models) {
            DisablityUser.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'disablityUserUserData',
            });
            DisablityUser.belongsTo(models.Disability, {
                foreignKey: 'disabilityId',
                as: 'disablityUserDisabilityData',
            });
        }
    }
    DisablityUser.init({
        disabilityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'disabilities', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        description: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        medicalFacilityRecords: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'DisablityUser',
    });
    return DisablityUser;
};