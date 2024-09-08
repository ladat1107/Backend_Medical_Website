'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('prescription', {
            examId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'examination',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            medicineId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'medicine',
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
            createAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            updateAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },

        });
        // Tạo chỉ mục cho surgicalhistoryId
        await queryInterface.addIndex('prescription', ['medicineId'], {
            name: 'fk_prescription_medicine_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('prescription');
    }
};