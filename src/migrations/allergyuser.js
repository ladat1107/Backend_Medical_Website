'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('allergyuser', {
            allergyId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'allgergy', // Tham chiếu đến bảng allgergy
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                primaryKey: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Tham chiếu đến bảng users
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                primaryKey: true,
            },
            discoveryDate: {
                type: Sequelize.DATE,
                allowNull: true,
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
        await queryInterface.addIndex('allergyuser', ['userId'], {
            name: 'fk_allergyuser_user_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('allergyuser');
    }
};