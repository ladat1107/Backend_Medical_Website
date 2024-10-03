'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('prescriptions', {
            examinationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'examinations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            note: {
                type: DataTypes.STRING(512),
                allowNull: false,
            },
            totalMoney: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            paymentStatus: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
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
        await queryInterface.addIndex('prescriptions', ['examinationId'], {
            name: 'fk_prescription_examination_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('prescriptions');
    }
};