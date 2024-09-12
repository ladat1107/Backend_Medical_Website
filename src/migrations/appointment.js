'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('appointments', {
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
                    model: 'staffs', // Tham chiếu đến bảng staffs
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
            cid: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            symptomNote: {
                type: Sequelize.STRING,
            },
            specialNote: {
                type: Sequelize.STRING,
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
        // Tạo chỉ mục cho staffId
        await queryInterface.addIndex('appointments', ['staffId'], {
            name: 'fk_appointment_staff_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('appointments');
    }
};