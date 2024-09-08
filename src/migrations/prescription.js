'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('prescriptions', {
            examId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'examinations',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            medicineId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'medicines',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            dosage: {
                type: Sequelize.STRING(128),
                allowNull: false,
            },
            totalAmount: {
                type: Sequelize.DOUBLE,
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
            },

        });
        // Tạo chỉ mục cho surgicalhistoryId
        await queryInterface.addIndex('prescriptions', ['medicineId'], {
            name: 'fk_prescription_medicine_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('prescriptions');
    }
};