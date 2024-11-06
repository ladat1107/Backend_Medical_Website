'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DepartmentSymptom extends Model {
        static associate(models) {
            // DepartmentSymptom.belongsTo(models.Symptom, {
            //     foreignKey: 'symptomId',
            //     as: 'departmentSymptomSymptomData',
            // });
            // DepartmentSymptom.belongsTo(models.Department, {
            //     foreignKey: 'departmentId',
            //     as: 'departmentSymptomDepartmentData',
            // });
        }
    }
    DepartmentSymptom.init({
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'departments', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        symptomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'symptoms', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
    }, {
        sequelize,
        modelName: 'DepartmentSymptom',
    });
    return DepartmentSymptom;
};