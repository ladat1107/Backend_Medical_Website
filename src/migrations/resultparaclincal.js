'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('resultparaclincal', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            examinationId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'examination', // Tên bảng tham chiếu
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            paraclincal: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            result: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            image: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            paymentStatus: {
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
            }
        });

        // Tạo chỉ mục cho examinationId
        await queryInterface.addIndex('resultparaclincal', ['examinationId'], {
            name: 'fk_resultparaclincal_examination_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('resultparaclincal');
    }
};