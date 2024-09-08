'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('diseaseusers', {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            diseaseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'diseases', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            illnessDuration: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            discoveryDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            medicalFacilityRecords: {
                type: DataTypes.STRING(512),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(1000),
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
        await queryInterface.addIndex('diseaseusers', ['diseaseId'], {
            name: 'fk_diseaseuser_disease_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('diseaseusers');
    }
};