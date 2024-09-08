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
                    model: 'department',   // Bảng tham chiếu
                    key: 'id',        // Khoá ngoại tham chiếu đến cột `id` của bảng `users`
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createAt: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updateAt: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
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