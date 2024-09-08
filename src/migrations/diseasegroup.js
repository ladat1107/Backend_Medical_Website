'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('diseasegroups', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            departmentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'departments',   // Bảng tham chiếu
                    key: 'id',        // Khoá ngoại tham chiếu đến cột `id` của bảng `users`
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        // Tạo các index cho các khoá ngoại
        await queryInterface.addIndex('diseasegroups', ['departmentId'], {
            name: 'fk_diseasegroups_department_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('diseasegroups');
    }
};