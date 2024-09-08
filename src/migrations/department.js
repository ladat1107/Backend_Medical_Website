'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('department', {
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
                    model: 'staff',   // Bảng tham chiếu
                    key: 'id',        // Khoá ngoại tham chiếu đến cột `id` của bảng `users`
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            status: {
                type: Sequelize.INTEGER,
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
            },
            locationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'location', // Tên bảng location
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
        await queryInterface.addIndex('department', ['locationId'], {
            name: 'fk_department_location_idx'
        });
        await queryInterface.addIndex('department', ['deanId'], {
            name: 'fk_department_staff_idx'
        });
        await queryInterface.addIndex('department', ['descriptionId'], {
            name: 'fk_department_description'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('department');
    }
};