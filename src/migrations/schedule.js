'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('schedules', {
            staffId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'staffs', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            roomId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'rooms', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            date: {
                type: DataTypes.DATE,
                allowNull: true,
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
        await queryInterface.addIndex('schedules', ['roomId'], {
            name: 'fk_schedule_room_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('schedules');
    }
};