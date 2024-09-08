'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('staffs', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            position: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',   // Bảng tham chiếu
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
            descriptionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'descriptions',  // Bảng tham chiếu
                    key: 'id',              // Khoá ngoại tham chiếu đến cột `id` của bảng `descriptions`
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            }
        });

        // Tạo các index cho các khoá ngoại
        await queryInterface.addIndex('staffs', ['descriptionId'], {
            name: 'fk_staff_description_idx'
        });
        await queryInterface.addIndex('staffs', ['userId'], {
            name: 'fk_staff_userId_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('staffs');
    }
};