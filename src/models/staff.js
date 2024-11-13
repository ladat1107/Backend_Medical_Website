'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Staff extends Model {
        static associate(models) {
            Staff.hasOne(models.Department, {
                foreignKey: 'deanId',
                as: 'deanDepartmentData',
            });
            Staff.hasMany(models.Handbook, {
                foreignKey: 'author',
                as: 'staffHandbookData',
            });
            Staff.belongsToMany(models.Room, {
                through: 'Schedule',
                foreignKey: 'staffId',
                as: 'scheduleStaffData',
            });
            Staff.hasMany(models.Appointment, {
                foreignKey: 'staffId',
                as: 'appointmentStaffData',
            });
            Staff.hasMany(models.Examination, {
                foreignKey: 'staffId',
                as: 'examinationStaffData',
            });
            Staff.hasMany(models.Paraclinical, {
                foreignKey: 'doctorId',
                as: 'doctorParaclinicalData',
            });
            Staff.belongsTo(models.Description, {
                foreignKey: 'descriptionId',
                as: 'staffDescriptionData',
            });
            Staff.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'staffUserData',
            });
            Staff.belongsTo(models.Department, {
                foreignKey: 'departmentId',
                as: 'staffDepartmentData',
            });
            Staff.belongsTo(models.Specialty, {
                foreignKey: 'specialtyId',
                as: 'staffSpecialtyData',
            });
            Staff.hasMany(models.Schedule, {
                foreignKey: 'staffId',
                as: 'staffScheduleData',
            })
        }
    }
    Staff.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                key: 'id',
            },
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        descriptionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'descriptions', // Tên bảng descriptions
                key: 'id',
            },
        },
        shortDescription: DataTypes.STRING,
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'departments', // Tên bảng departments
                key: 'id',
            },
        },
        specialtyId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Staff',
    });
    return Staff;
};