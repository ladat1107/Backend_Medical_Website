'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('rooms', {
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
            typeRoom: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'roomtype', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            locationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'location', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            medicalExamination: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'department', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
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

        // Tạo các index cho các khoá ngoại
        await queryInterface.addIndex('rooms', ['typeRoom'], {
            name: 'fk_rooms_roomtype_idx'
        });
        await queryInterface.addIndex('rooms', ['locationId'], {
            name: 'fk_rooms_location_idx'
        });
        await queryInterface.addIndex('rooms', ['medicalExamination'], {
            name: 'fk_rooms_department_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('rooms');
    }
};