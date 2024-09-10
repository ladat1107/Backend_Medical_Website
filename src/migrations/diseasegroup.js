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
            groupName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            groupCode: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            chapterId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'chapters',   // Bảng tham chiếu
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
        await queryInterface.addIndex('diseasegroups', ['chapterId'], {
            name: 'fk_diseasegroups_chapters_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('diseasegroups');
    }
};