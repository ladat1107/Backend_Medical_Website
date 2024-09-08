'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('comorbidities', {
            examinationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'examinations', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
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

        // Tạo các index cho các khoá ngoại
        await queryInterface.addIndex('comorbidities', ['diseaseId'], {
            name: 'fk_comorbidities_disease_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('comorbidities');
    }
};