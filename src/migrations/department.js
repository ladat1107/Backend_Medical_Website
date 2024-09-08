'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('departments', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            deanId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'staffs',   // Bảng tham chiếu
                    key: 'id',        // Khoá ngoại tham chiếu đến cột `id` của bảng `users`
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            status: {
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
            locationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'locations', // Tên bảng locations
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            descriptionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'descriptions', // Tên bảng descriptions
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            }
        });

        // Tạo các index cho các khoá ngoại
        await queryInterface.addIndex('departments', ['locationId'], {
            name: 'fk_department_location_idx'
        });
        await queryInterface.addIndex('departments', ['deanId'], {
            name: 'fk_department_staff_idx'
        });
        await queryInterface.addIndex('departments', ['descriptionId'], {
            name: 'fk_department_description'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('departments');
    }
};