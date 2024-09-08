'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('familyhistories', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            relationship: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            diseaseGroup: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            disease_name: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            description: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            discoveryDate: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            illnessDuration: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            medicalFacilityRecords: {
                type: Sequelize.STRING(45),
                allowNull: true,
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
            createdAt: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            }
        });

        // Tạo chỉ mục cho userId
        await queryInterface.addIndex('familyhistories', ['userId'], {
            name: 'fk_familyhistory_user_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('familyhistories');
    }
};