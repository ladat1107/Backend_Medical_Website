'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('departmentsymptoms', {
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
            createdAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            }
        });
        // Tạo chỉ mục cho userId
        await queryInterface.addIndex('departmentsymptoms', ['symptomId'], {
            name: 'fk_DepartmentSymptoms_Symptoms_idx'
        });

    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('departmentsymptoms');
    }
};