'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SurgicalhistoryUser extends Model {
        static associate(models) {
            SurgicalhistoryUser.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'surgicalhistoryUserUserData',
            });
            SurgicalhistoryUser.belongsTo(models.SurgicalHistory, {
                foreignKey: 'surgicalhistoryId',
                as: 'surgicalhistoryUserSurgicalhistoryData',
            });
        }
    }
    SurgicalhistoryUser.init({
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
        surgicalhistoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'surgicalhistories', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        implementationDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        medicalFacilityRecords: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
       
    }, {
        sequelize,
        modelName: 'SurgicalhistoryUser',
    });
    return SurgicalhistoryUser;
};