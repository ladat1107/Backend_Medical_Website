'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('appointment', {
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Tham chiếu đến bảng users
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                primaryKey: true,
            },
            staffId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'staff', // Tham chiếu đến bảng staff
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                primaryKey: true,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
                primaryKey: true,
            },
            time: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
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
            }
        });
        // Tạo chỉ mục cho staffId
        await queryInterface.addIndex('appointment', ['staffId'], {
            name: 'fk_appointment_staff_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('appointment');
    }
};