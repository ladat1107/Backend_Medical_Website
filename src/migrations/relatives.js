'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('relatives', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            fullName: {
                type: Sequelize.STRING(128),
                allowNull: false,
            },
            cid: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            relationship: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING(512),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(512),
                allowNull: true,
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Bảng users đã tồn tại
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
        await queryInterface.addIndex('relatives', ['userId'], {
            name: 'fk_relatives_user_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('relatives');
    }
};