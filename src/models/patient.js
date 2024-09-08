'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Patient extends Model {
        static associate(models) {
        }
    }
    Patient.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        dateOfAdmission: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dateOfDischarge: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        bedId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'beds', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        createAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updateAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        }
    }, {
        sequelize,
        modelName: 'Patient',
    });
    return Patient;
};