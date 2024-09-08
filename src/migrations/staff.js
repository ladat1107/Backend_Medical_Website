'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('staff', {
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
        await queryInterface.addIndex('staff', ['descriptionId'], {
            name: 'fk_staff_description_idx'
        });
        await queryInterface.addIndex('staff', ['userId'], {
            name: 'fk_staff_userId_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('staff');
    }
};