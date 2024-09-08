'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('vitalsigns', {
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
                    model: 'examinations', // Tên bảng tham chiếu
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            height: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            weight: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            fetalWeight: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            pulse: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            temperature: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            hightBloodPressure: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            low_blood_pressure: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            breathing_rate: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            glycemic_index: {
                type: Sequelize.DOUBLE,
                allowNull: true,
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

        // Tạo chỉ mục cho examinationId
        await queryInterface.addIndex('vitalsigns', ['examinationId'], {
            name: 'fk_vitalsign_examination_idx'
        });

    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('vitalsigns');
    }
};