'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Patient extends Model {
        static associate(models) {
            Patient.belongsTo(models.Bed, {
                foreignKey: 'bedId',
                as: 'bedPatientData',
            });
            Patient.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'patientUserData',
            });
        }
    }
    Patient.init({
        dateOfAdmission: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dateOfDischarge: {
            type: DataTypes.DATE,
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
        
    }, {
        sequelize,
        modelName: 'Patient',
    });
    return Patient;
};