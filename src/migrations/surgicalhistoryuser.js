'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('surgicalhistoryusers', {
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Bảng users đã tồn tại
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                primaryKey: true,
            },
            surgicalhistoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'surgicalhistories', // Bảng surgicalhistories đã tồn tại
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                primaryKey: true,
            },
            description: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            implementationDate: {
                type: Sequelize.DATE,
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

        // Tạo chỉ mục cho surgicalhistoryId
        await queryInterface.addIndex('surgicalhistoryusers', ['surgicalhistoryId'], {
            name: 'fk_surgicalhistoryuser_surgicalhistory_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('surgicalhistoryusers');
    }
};