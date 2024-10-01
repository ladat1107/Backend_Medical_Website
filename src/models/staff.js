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
            Staff.hasMany(models.Schedule, {
                foreignKey: 'staffId',
                as: 'scheduleStaffData',
            });
            Staff.hasMany(models.Appointment, {
                foreignKey: 'staffId',
                as: 'appointmentStaffData',
            });
            Staff.hasMany(models.Examination, {
                foreignKey: 'staffId',
                as: 'staffExaminationData',
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
        }
    }
    Staff.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        price:{
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'departments', // Tên bảng departments
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    }, {
        sequelize,
        modelName: 'Staff',
    });
    return Staff;
};