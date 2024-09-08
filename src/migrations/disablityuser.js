'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('disablityusers', {
            disabilityId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'disabilities', // Tham chiếu đến bảng disabilities
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
            description: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            medicalFacilityRecords: {
                type: Sequelize.STRING(45),
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
        await queryInterface.addIndex('disablityusers', ['userId'], {
            name: 'fk_disability_user_idx'
        });

    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('disablityusers');
    }
};