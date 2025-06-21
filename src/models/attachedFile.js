'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AttachFile extends Model {
        static associate(models) {
            AttachFile.belongsTo(models.Notification, {
                foreignKey: 'notiCode',
                targetKey: 'notiCode', // Specify targetKey to match the foreign key
                as: 'AttachFileNotificationData',
            });
        }
    }
    AttachFile.init({
        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notiCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'AttachFile',
    });
    return AttachFile;
};