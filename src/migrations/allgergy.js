'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('allgergys', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            userID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Tham chiếu đến bảng users
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            agent: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            diseaseManifestation: {
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

        // Tạo chỉ mục cho userID
        await queryInterface.addIndex('allgergys', ['userID'], {
            name: 'fk_allgergy_user_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('allgergys');
    }
};