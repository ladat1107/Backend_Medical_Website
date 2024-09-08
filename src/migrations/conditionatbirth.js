'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('conditionatbirths', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Tham chiếu đến bảng users
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            typeOfBirth: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            weight: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            height: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            detail: {
                type: Sequelize.STRING(45),
                allowNull: true,
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
        // Tạo chỉ mục cho userId
        await queryInterface.addIndex('conditionatbirths', ['userId'], {
            name: 'fk_conditionatbirth_user_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('conditionatbirths');
    }
};