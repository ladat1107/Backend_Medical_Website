'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('symptomdiseases', {
            symptomId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'symptoms', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
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
        await queryInterface.addIndex('symptomdiseases', ['diseaseId'], {
            name: 'fk_symptomdisease_disease_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('symptomdiseases');
    }
};