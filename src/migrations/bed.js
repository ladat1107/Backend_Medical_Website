'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('beds', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(256),
                allowNull: false,
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
            }
        });

        // Tạo các index cho các khoá ngoại
        await queryInterface.addIndex('beds', ['roomId'], {
            name: 'fk_beds_rooms_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('beds');
    }
};